"use client"
import React, { useState } from "react"

// Using the existing component definitions from the provided code
const LoadingSpinner = () => (
  <div className="animate-spin h-5 w-5 border-2 border-blue-500 border-t-transparent rounded-full" />
)

const Card = ({ children, className = "" }) => (
  <div className={`bg-white rounded-lg shadow-lg border border-gray-200 ${className}`}>{children}</div>
)

const CardContent = ({ children, className = "" }) => <div className={`px-6 py-4 ${className}`}>{children}</div>

const Button = ({ children, onClick, disabled, variant = "primary", className = "" }) => {
  const baseStyles = "px-4 py-2 rounded-md font-medium transition-all duration-200 text-sm focus:outline-none"
  const variants = {
    primary: "bg-blue-600 text-white hover:bg-blue-700 disabled:bg-blue-300",
    secondary: "bg-gray-100 text-gray-700 hover:bg-gray-200 disabled:bg-gray-50",
    outline: "border border-gray-300 text-gray-700 hover:bg-gray-50 disabled:bg-gray-50",
  }

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`${baseStyles} ${variants[variant]} ${className} disabled:cursor-not-allowed`}
    >
      {disabled && variant === "primary" ? <LoadingSpinner /> : children}
    </button>
  )
}

const Input = ({ label, value, onChange, placeholder, className = "" }) => (
  <div className="mb-4">
    {label && <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>}
    <input
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      className={`w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm
      focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 
      placeholder-gray-400 ${className}`}
    />
  </div>
)

const TextArea = ({ label, value, onChange, placeholder, rows = 4, className = "" }) => (
  <div className="mb-4">
    {label && <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>}
    <textarea
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      rows={rows}
      className={`w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm
      focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 
      placeholder-gray-400 ${className}`}
    />
  </div>
)

const Tabs = ({ tabs, activeTab, onTabChange }) => (
  <div className="border-b border-gray-200 mb-6">
    <nav className="-mb-px flex space-x-8">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          onClick={() => onTabChange(tab.id)}
          className={`py-2 px-1 border-b-2 text-sm font-medium transition-colors duration-200 ${
            activeTab === tab.id
              ? "border-blue-500 text-blue-600"
              : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
          }`}
        >
          {tab.label}
        </button>
      ))}
    </nav>
  </div>
)

const downloadDocument = (content, templateName, docType) => {
  if (!content) {
    throw new Error(`No ${docType} document content to download`)
  }

  const timestamp = new Date().toISOString().split('T')[0]
  const fileName = `${templateName.toLowerCase()}-${docType}-${timestamp}.txt`
  const blob = new Blob([content], { type: "text/plain;charset=utf-8" })
  const url = URL.createObjectURL(blob)
  
  const link = document.createElement("a")
  link.href = url
  link.download = fileName
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  URL.revokeObjectURL(url)
}

export default function LegalDocumentGenerator() {
  const [loading, setLoading] = useState(false)
  const [document, setDocument] = useState("")
  const [selectedTemplate, setSelectedTemplate] = useState("")
  const [formData, setFormData] = useState({})
  const [aiInstructions, setAiInstructions] = useState("")
  const [aiTemperature, setAiTemperature] = useState(0.7)
  const [error, setError] = useState("")
  const [activeTab, setActiveTab] = useState("generate")
  const [enhancedDocument, setEnhancedDocument] = useState("")

  // Template definitions remain the same
  const TEMPLATES = {
    SERVICE_AGREEMENT: {
      name: "Service Agreement",
      fields: [
        "SERVICE_PROVIDER_NAME",
        "CLIENT_NAME",
        "SERVICES",
        "AMOUNT",
        "PAYMENT_TERMS",
        "START_DATE",
        "END_DATE",
        "NOTICE_PERIOD",
      ],
    },
    EMPLOYMENT_AGREEMENT: {
      name: "Employment Agreement",
      fields: [
        "EMPLOYER_NAME",
        "EMPLOYEE_NAME",
        "POSITION",
        "START_DATE",
        "AMOUNT",
        "BENEFITS",
        "HOURS",
        "DETAILED_RESPONSIBILITIES",
      ],
    },
    RENTAL_AGREEMENT: {
      name: "Rental Agreement",
      fields: [
        "LANDLORD_NAME",
        "TENANT_NAME",
        "DATE",
        "PROPERTY_ADDRESS",
        "START_DATE",
        "END_DATE",
        "AMOUNT",
        "DEPOSIT_AMOUNT",
        "UTILITIES_LIST",
        "MAINTENANCE_TERMS",
      ],
    },
    POWER_OF_ATTORNEY: {
      name: "Power of Attorney",
      fields: ["PRINCIPAL_NAME", "ADDRESS", "ATTORNEY_NAME", "END_DATE"],
    },
    LAST_WILL: {
      name: "Last Will and Testament",
      fields: ["FULL_NAME", "ADDRESS", "SPOUSE_NAME", "CHILDREN_NAMES", "DISTRIBUTION_DETAILS", "EXECUTOR_NAME"],
    },
    PRIVACY_POLICY: {
      name: "Privacy Policy",
      fields: ["DATE", "COMPANY_NAME"],
    },
  }

  const dummyData = {
    SERVICE_AGREEMENT: {
      SERVICE_PROVIDER_NAME: "ABC Consulting",
      CLIENT_NAME: "XYZ Corp",
      SERVICES: "IT consulting and software development",
      AMOUNT: "$10,000",
      PAYMENT_TERMS: "50% upfront, 50% upon completion",
      START_DATE: "2025-02-01",
      END_DATE: "2025-07-31",
      NOTICE_PERIOD: "30 days",
    },
    EMPLOYMENT_AGREEMENT: {
      EMPLOYER_NAME: "Tech Innovations Inc.",
      EMPLOYEE_NAME: "Jane Doe",
      POSITION: "Senior Software Engineer",
      START_DATE: "2025-03-15",
      AMOUNT: "$120,000 per year",
      BENEFITS: "Health insurance, 401(k) matching, 20 days PTO",
      HOURS: "40 hours per week",
      DETAILED_RESPONSIBILITIES: "Lead development team, architect solutions, code review",
    },
    RENTAL_AGREEMENT: {
      LANDLORD_NAME: "Smith Properties LLC",
      TENANT_NAME: "John Johnson",
      DATE: "2025-02-15",
      PROPERTY_ADDRESS: "123 Main St, Anytown, ST 12345",
      START_DATE: "2025-03-01",
      END_DATE: "2026-02-29",
      AMOUNT: "$1,500 per month",
      DEPOSIT_AMOUNT: "$2,250",
      UTILITIES_LIST: "Electricity, water, gas, internet",
      MAINTENANCE_TERMS: "Tenant responsible for minor repairs under $100",
    },
    POWER_OF_ATTORNEY: {
      PRINCIPAL_NAME: "Alice Brown",
      ADDRESS: "456 Oak Ave, Somewhere, ST 67890",
      ATTORNEY_NAME: "Robert Green",
      END_DATE: "2026-12-31",
    },
    LAST_WILL: {
      FULL_NAME: "Emily White",
      ADDRESS: "789 Pine Rd, Elsewhere, ST 13579",
      SPOUSE_NAME: "Michael White",
      CHILDREN_NAMES: "Sarah White, Thomas White",
      DISTRIBUTION_DETAILS: "Estate to be divided equally between spouse and children",
      EXECUTOR_NAME: "David Gray",
    },
    PRIVACY_POLICY: {
      DATE: "2025-01-30",
      COMPANY_NAME: "WebTech Solutions",
    },
  }

  const handleTemplateSelect = (templateId) => {
    setSelectedTemplate(templateId)
    setDocument("")
    setFormData(dummyData[templateId])
    setError("")
  }

  const handleDownload = (docType) => {
    try {
      const content = docType === "enhanced" ? enhancedDocument : document
      const templateName = selectedTemplate ? TEMPLATES[selectedTemplate].name : "document"
      downloadDocument(content, templateName, docType)
      setError("")
    } catch (err) {
      console.error("Download error:", err)
      setError(err.message || `Failed to download ${docType} document. Please try again.`)
    }
  }

  const handleGenerate = async () => {
    if (!selectedTemplate) {
      setError("Please select a template")
      return
    }

    setLoading(true)
    setError("")

    try {
      const response = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          docType: selectedTemplate,
          inputs: formData,
        }),
      })

      const data = await response.json()
      if (!response.ok) throw new Error(data.error || "Failed to generate document")
      setDocument(data.document)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const handleEnhance = async () => {
    if (!document || !aiInstructions) {
      setError("Please provide both a document and enhancement instructions")
      return
    }

    setLoading(true)
    setError("")

    try {
      const response = await fetch("/api/enhance", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          document: document,
          instructions: aiInstructions,
          temperature: aiTemperature,
        }),
      })

      const data = await response.json()
      if (!response.ok) throw new Error(data.error || "Failed to enhance document")
      setEnhancedDocument(data.enhanced)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 mt-4">
      <div className="max-w-[1400px] mx-auto">
       

        {/* Split Layout */}
        <div className="flex">
          {/* Left Sidebar */}
          <div className="w-80 min-h-[calc(100vh-64px)] border-r bg-white p-6">
            <div className="space-y-6">
              <div>
                <h2 className="text-lg font-semibold mb-4">Document Templates</h2>
                <div className="space-y-4">
                  {Object.entries(TEMPLATES).map(([key, template]) => (
                    <div
                      key={key}
                      onClick={() => handleTemplateSelect(key)}
                      className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
                        selectedTemplate === key
                          ? "border-purple-500 bg-purple-50"
                          : "border-gray-200 hover:border-purple-200"
                      }`}
                    >
                      <h3 className="font-medium">{template.name}</h3>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1 min-h-[calc(100vh-64px)] p-6">
            {error && <div className="mb-4 p-4 bg-red-50 border border-red-200 text-red-600 rounded-md">{error}</div>}

            {selectedTemplate ? (
              <Card>
                <CardContent>
                  <div className="flex justify-between items-center mb-6">
                    <h2 className="text-xl font-semibold">{TEMPLATES[selectedTemplate].name}</h2>
                    <div className="flex items-center gap-2">
                      <Button variant="outline">Preview</Button>
                      <Button variant="outline" onClick={() => setActiveTab("enhance")}>
                        AI Edit
                      </Button>
                      <Button variant="outline">Edit</Button>
                      <Button variant="outline">Copy</Button>
                      {activeTab === "generate" ? (
                        <Button variant="outline" onClick={() => handleDownload("generated")} disabled={!document}>
                          Download Generated
                        </Button>
                      ) : (
                        <Button variant="outline" onClick={() => handleDownload("enhanced")} disabled={!enhancedDocument}>
                          Download Enhanced
                        </Button>
                      )}
                    </div>
                  </div>

                  <Tabs
                    tabs={[
                      { id: "generate", label: "Generate Document" },
                      { id: "enhance", label: "AI Enhancement" },
                    ]}
                    activeTab={activeTab}
                    onTabChange={setActiveTab}
                  />

                  {activeTab === "generate" && (
                    <div className="grid grid-cols-2 gap-6">
                      <div>
                        {TEMPLATES[selectedTemplate].fields.map((fieldName) => (
                          <Input
                            key={fieldName}
                            label={fieldName.replace(/_/g, " ").toLowerCase()}
                            value={formData[fieldName] || ""}
                            onChange={(e) =>
                              setFormData((prev) => ({
                                ...prev,
                                [fieldName]: e.target.value,
                              }))
                            }
                            placeholder={`Enter ${fieldName.toLowerCase().replace(/_/g, " ")}`}
                          />
                        ))}
                        <div className="mt-6">
                          <Button onClick={handleGenerate} disabled={loading} className="w-full">
                            {loading ? "Generating..." : "Generate Document"}
                          </Button>
                        </div>
                      </div>
                      <div>
                        <TextArea
                          value={document}
                          onChange={(e) => setDocument(e.target.value)}
                          placeholder="Generated document will appear here..."
                          rows={20}
                          className="font-mono"
                        />
                      </div>
                    </div>
                  )}

                  {activeTab === "enhance" && (
                    <div className="space-y-6">
                      <TextArea
                        label="Enhancement Instructions"
                        value={aiInstructions}
                        onChange={(e) => setAiInstructions(e.target.value)}
                        placeholder="Enter instructions for enhancing the document..."
                        rows={6}
                      />
                      <div className="flex items-center gap-4">
                        <label className="flex items-center gap-2">
                          <span className="text-sm font-medium text-gray-700">AI Temperature:</span>
                          <input
                            type="range"
                            min="0"
                            max="1"
                            step="0.1"
                            value={aiTemperature}
                            onChange={(e) => setAiTemperature(Number.parseFloat(e.target.value))}
                            className="w-32"
                          />
                          <span className="text-sm text-gray-500">{aiTemperature}</span>
                        </label>
                        <Button onClick={handleEnhance} disabled={loading || !document} className="ml-auto">
                          {loading ? "Enhancing..." : "Enhance Document"}
                        </Button>
                      </div>
                      <TextArea
                        value={enhancedDocument}
                        onChange={(e) => setEnhancedDocument(e.target.value)}
                        placeholder="Enhanced document will appear here..."
                        rows={20}
                        className="font-mono"
                      />
                    </div>
                  )}
                </CardContent>
              </Card>
            ) : (
              <div className="text-center text-gray-500 py-12">Select a template from the sidebar to get started</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

