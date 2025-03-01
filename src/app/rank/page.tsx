"use client";
import React, { useEffect, useState } from "react";
import { Flex, Card, Select, Button, InputNumber, Table } from "antd";

// Utility function to fetch JSON files from the API
const fetchJsonFiles = async (): Promise<string[]> => {
  const response = await fetch("/api/json-files");
  if (!response.ok) {
    throw new Error("Failed to fetch JSON files");
  }
  const data = await response.json();
  return data.files; // Array of JSON file names
};

// Utility function to load JSON data
const loadJsonData = async (fileName: string): Promise<any[]> => {
  const response = await fetch(`/data/${fileName}`);
  if (!response.ok) {
    throw new Error(`Failed to load JSON data for file: ${fileName}`);
  }
  const data = await response.json();
  return data;
};

const Page: React.FC = () => {
  const [jsonFiles, setJsonFiles] = useState<string[]>([]);
  const [selectedFile, setSelectedFile] = useState<string | null>(null);
  const [jsonData, setJsonData] = useState<any[]>([]);
  const [filters, setFilters] = useState<Record<string, any>>({});
  const [uniqueValues, setUniqueValues] = useState<Record<string, any[]>>({});

  // Fetch available JSON files on component mount
  useEffect(() => {
    fetchJsonFiles().then((files) => setJsonFiles(files));
  }, []);

  // Load JSON data when a file is selected
  useEffect(() => {
    if (selectedFile) {
      loadJsonData(selectedFile).then((data) => {
        setJsonData(data);

        // Extract unique values for each field
        const uniqueFieldValues: Record<string, any[]> = {};
        data.forEach((item) => {
          Object.keys(item).forEach((key) => {
            if (!uniqueFieldValues[key]) uniqueFieldValues[key] = [];
            if (!uniqueFieldValues[key].includes(item[key])) {
              uniqueFieldValues[key].push(item[key]);
            }
          });
        });

        setUniqueValues(uniqueFieldValues);
        setFilters({});
      });
    }
  }, [selectedFile]);

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
        {/* JSON File Selector */}
        <Card title="Select JSON File">
          <Select
            placeholder="Select a JSON file"
            value={selectedFile}
            onChange={(value) => setSelectedFile(value)}
            options={jsonFiles.map((file) => ({ value: file, label: file }))}
            style={{ width: "100%" }}
          />
        </Card>

        {/* Filters Card */}
        {selectedFile && (
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
        {selectedFile && (
          <div >
            <div style={{ overflowX: "auto"  }}>
              <Table
                dataSource={filteredData}
                columns={Object.keys(jsonData[0] || {}).map((key) => ({
                  title: key,
                  dataIndex: key,
                  key: key,
                }))}
                rowKey={(record) => record.SNo || Math.random().toString()}
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