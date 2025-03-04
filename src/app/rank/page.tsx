"use client";
import React, { useEffect, useState } from "react";
import { Flex, Card, Select, Button, Table } from "antd";

interface DataItem {
  _id: string;
  listCategory: string;
  listSubCategory: string;
  [key: string]: any;
}

const Page: React.FC = () => {
  const [jsonData, setJsonData] = useState<DataItem[]>([]);
  const [filters, setFilters] = useState<Record<string, string | null>>({});
  const [uniqueListCategories, setUniqueListCategories] = useState<string[]>([]);
  const [uniqueListSubCategories, setUniqueListSubCategories] = useState<string[]>([]);
  const [selectedListCategory, setSelectedListCategory] = useState<string | null>(null);
  const [uniqueFieldValues, setUniqueFieldValues] = useState<Record<string, string[]>>({});

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("/api/data");
        if (!response.ok) throw new Error("Failed to fetch data");
        const data: { data: DataItem[] } = await response.json();
        setJsonData(data.data || []);

        const categories = [...new Set(data.data.map((item: DataItem) => item.listCategory))];
        setUniqueListCategories(categories);

        // Extract unique values for all other fields
        if (data.data && data.data.length > 0) {
          const unique: Record<string, string[]> = {};
          Object.keys(data.data[0]).forEach((key) => {
            if (key !== "listCategory" && key !== "listSubCategory" && key !== "_id") {
              unique[key] = [...new Set(data.data.map((item: DataItem) => String(item[key])))];
            }
          });
          setUniqueFieldValues(unique);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    if (selectedListCategory) {
      const subCategories = [
        ...new Set(
          jsonData
            .filter((item) => item.listCategory === selectedListCategory)
            .map((item) => item.listSubCategory)
        ),
      ];
      setUniqueListSubCategories(subCategories);
    } else {
      setUniqueListSubCategories([]);
    }
  }, [selectedListCategory, jsonData]);

  const handleListCategoryChange = (value: string | null) => {
    setSelectedListCategory(value);
    setFilters((prev) => ({ ...prev, listCategory: value, listSubCategory: null }));
  };

  const handleFilterChange = (field: string, value: string | null) => {
    setFilters((prev) => ({ ...prev, [field]: value }));
  };

  const clearFilters = () => {
    setFilters({});
    setSelectedListCategory(null);
  };

  const filteredData = jsonData.filter((item) =>
    Object.keys(filters).every((key) => {
      if (!filters[key]) return true;
      return String(item[key]).toLowerCase() === String(filters[key]).toLowerCase();
    })
  );

  return (
    <div className="p-5">
      <Flex gap="middle" vertical>
        <Card title="Select Category">
          <Select
            placeholder="Select a Category"
            value={selectedListCategory}
            onChange={handleListCategoryChange}
            options={uniqueListCategories.map((cat) => ({ value: cat, label: cat }))}
            style={{ width: "100%" }}
          />
        </Card>

        {selectedListCategory && (
          <Card title="Select Sub-Category">
            <Select
              placeholder="Select a Sub-Category"
              value={filters.listSubCategory}
              onChange={(value) => handleFilterChange("listSubCategory", value)}
              options={uniqueListSubCategories.map((subCat) => ({ value: subCat, label: subCat }))}
              style={{ width: "100%" }}
              allowClear
            />
          </Card>
        )}

        <Card title="Available Filters & Data Tweaks">
          {Object.keys(uniqueFieldValues).map((field) => (
            <div key={field} style={{ marginBottom: "10px" }}>
              <Select
                showSearch
                allowClear
                placeholder={`Select ${field}`}
                value={filters[field]}
                onChange={(value) => handleFilterChange(field, value)}
                options={uniqueFieldValues[field].map((val) => ({ value: val, label: val }))}
                style={{ width: "100%" }}
              />
            </div>
          ))}
          <Button danger type="primary" onClick={clearFilters} style={{ marginBottom: 16 }}>
            Clear All Filters
          </Button>
        </Card>

        {jsonData.length > 0 && (
          <div>
            <div style={{ overflowX: "auto" }}>
              <Table
                dataSource={filteredData}
                columns={Object.keys(jsonData[0] || {})
                  .filter((key) => !["_id", "SNo", "listCategory", "listSubCategory"].includes(key))
                  .map((key) => ({
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