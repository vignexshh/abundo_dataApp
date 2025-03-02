"use client";
import React, { useEffect, useState } from "react";
import { Flex, Card, Select, Button, InputNumber, Table } from "antd";

const Page: React.FC = () => {
  const [databases, setDatabases] = useState<string[]>([]);
  const [selectedDatabase, setSelectedDatabase] = useState<string | null>(null);
  const [collections, setCollections] = useState<string[]>([]);
  const [selectedCollection, setSelectedCollection] = useState<string | null>(null);
  const [jsonData, setJsonData] = useState<any[]>([]);
  const [filters, setFilters] = useState<Record<string, any>>({});
  const [uniqueValues, setUniqueValues] = useState<Record<string, any[]>>({});

  // Fetch available databases
  useEffect(() => {
    fetch("/api/databases")
      .then((response) => {
        if (!response.ok) throw new Error("Failed to fetch databases");
        return response.json();
      })
      .then((data) => setDatabases(data.databases || []))
      .catch((error) => console.error("Error fetching databases:", error));
  }, []);

  // Fetch collections when a database is selected
  useEffect(() => {
    if (selectedDatabase) {
      fetch(`/api/collections?db=${selectedDatabase}`)
        .then((response) => {
          if (!response.ok) throw new Error("Failed to fetch collections");
          return response.json();
        })
        .then((data) => setCollections(data.collections || []))
        .catch((error) => console.error("Error fetching collections:", error));
    }
  }, [selectedDatabase]);

  // Load data when a collection is selected
  useEffect(() => {
    if (selectedDatabase && selectedCollection) {
      fetch(`/api/data?db=${selectedDatabase}&collection=${selectedCollection}`)
        .then((response) => {
          if (!response.ok) throw new Error("Failed to fetch data");
          return response.json();
        })
        .then((data) => {
          setJsonData(data);

          // Extract unique values for each field
          const uniqueFieldValues: Record<string, any[]> = {};
          data.forEach((item: any) => {
            Object.keys(item).forEach((key) => {
              if (!uniqueFieldValues[key]) uniqueFieldValues[key] = [];
              if (!uniqueFieldValues[key].includes(item[key])) {
                uniqueFieldValues[key].push(item[key]);
              }
            });
          });

          setUniqueValues(uniqueFieldValues);
          setFilters({});
        })
        .catch((error) => console.error("Error fetching data:", error));
    }
  }, [selectedDatabase, selectedCollection]);

  // Handle filter changes
  const handleFilterChange = (field: string, value: any) => {
    setFilters((prev) => ({ ...prev, [field]: value }));
  };

  // Clear all filters
  const clearFilters = () => {
    setFilters({});
  };

  // Filtered data based on current filters
  const filteredData = jsonData.filter((item) =>
    Object.keys(filters).every((key) => {
      if (filters[key] === undefined || filters[key] === null) return true;
      return String(item[key]).toLowerCase().includes(String(filters[key]).toLowerCase());
    })
  );

  // Dynamically generate filter components
  const renderFilterComponent = (field: string, values: any[]) => {
    const isInteger = values.every((val) => typeof val === "number" && Number.isInteger(val));

    if (isInteger) {
      return (
        <InputNumber
          placeholder={`Enter ${field}`}
          value={filters[field]}
          onChange={(value) => handleFilterChange(field, value)}
          min={1}
          style={{ width: "100%" }}
        />
      );
    }

    const options = values.map((value) => ({
      value,
      label: value,
    }));

    return (
      <Select
        showSearch={values.length > 8}
        allowClear
        placeholder={`Select ${field}`}
        value={filters[field]}
        onChange={(value) => handleFilterChange(field, value)}
        options={options}
        style={{ width: "100%" }}
      />
    );
  };

  // Grid style for responsive layout
  const gridStyle: React.CSSProperties = {
    width: "50%",
    textAlign: "start",
    padding: 10,
    paddingLeft: 25,
    paddingRight: 25,
  };

  return (
    <div className="p-5">
      <Flex gap="middle" vertical>
        {/* Database Selector */}
        <Card title="Select Database">
          <Select
            placeholder="Select a database"
            value={selectedDatabase}
            onChange={(value) => setSelectedDatabase(value)}
            options={databases.map((db) => ({ value: db, label: db }))}
            style={{ width: "100%" }}
          />
        </Card>

        {/* Collection Selector */}
        {selectedDatabase && (
          <Card title="Select Collection">
            <Select
              placeholder="Select a collection"
              value={selectedCollection}
              onChange={(value) => setSelectedCollection(value)}
              options={collections.map((coll) => ({ value: coll, label: coll }))}
              style={{ width: "100%" }}
            />
          </Card>
        )}

        {/* Filters Card */}
        {selectedCollection && (
          <Card title="Available Filters & Data Tweaks">
            {Object.keys(uniqueValues).map((field, index) => (
              <Card.Grid hoverable={false} key={field} style={gridStyle}>
                <div className="pt-5 pb-5 flex flex-row items-center gap-5">
                  <p className="font-bold">{field}:</p>
                  {renderFilterComponent(field, uniqueValues[field])}
                </div>
              </Card.Grid>
            ))}
            <Button danger type="primary" onClick={clearFilters} style={{ marginBottom: 16 }}>
              Clear All Filters
            </Button>
          </Card>
        )}

        {/* Data Table Card */}
        {selectedCollection && (
          <div>
            <div style={{ overflowX: "auto" }}>
              <Table
                dataSource={filteredData}
                columns={Object.keys(jsonData[0] || {}).map((key) => ({
                  title: key,
                  dataIndex: key,
                  key: key,
                }))}
                rowKey={(record) => record._id || Math.random().toString()}
                pagination={{ pageSize: 10 }}
                style={{ minHeight: 100 }}
              />
            </div>
          </div>
        )}
      </Flex>
    </div>
  );
};

export default Page;