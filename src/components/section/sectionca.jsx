"use client"

import React, { useState } from "react"
import { toast, Toaster } from "react-hot-toast"
import axios from "axios"

export default function CACompliance() {
  const [clientType, setClientType] = useState("Individual")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formData, setFormData] = useState({
    clientType: "Individual",
    companySize: "1-10",
  })

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleClientTypeChange = (type) => {
    setClientType(type)
    setFormData({
      clientType: type,
      companySize: type === "Firm" ? "1-10" : undefined,
      email: "",
      phone: "",
      message: "",
      preferredDate: "",
      consultationType: "",
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      const submissionData = {
        ...formData,
        clientType,
        ...(clientType === "Firm" && { companySize: formData.companySize || "1-10" }),
      }

      // First create payment session
      const paymentResponse = await fetch("/api/create-payment-session-ca", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(submissionData),
      })

      const paymentData = await paymentResponse.json()

      if (!paymentResponse.ok) {
        throw new Error(paymentData.message || "Payment session creation failed")
      }

      // Redirect to Stripe checkout
      if (paymentData.success === true) {
        const res = await axios.post('/api/book-consultation', submissionData, {
          headers: {
            'Content-Type': 'application/json',
          }
        });
        console.log(res);
      } 
      window.location.href = paymentData.sessionUrl
    } catch (error) {
      console.error("Submission error:", error)
      toast.error(error.message || "Failed to process payment")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-white">
      <Toaster position="top-center" />
      <div className="max-w-7xl mx-auto px-4 py-12">
        <h1 className="text-3xl font-bold text-center mb-8">Book a CA Consultation</h1>

        <div className="flex flex-col lg:flex-row gap-8">
          <div className="lg:w-2/3">
            <div className="bg-white shadow-sm border border-gray-200 rounded-lg p-6">
              <div className="flex gap-4 mb-6">
                {["Individual", "Firm"].map((type) => (
                  <button
                    key={type}
                    type="button"
                    onClick={() => handleClientTypeChange(type)}
                    className={`flex-1 py-2 px-4 rounded-md transition-colors ${
                      clientType === type ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                    }`}
                  >
                    {type}
                  </button>
                ))}
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                {clientType === "Individual" ? (
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Full Name</label>
                    <input
                      type="text"
                      name="name"
                      required
                      onChange={handleInputChange}
                      value={formData.name || ""}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    />
                  </div>
                ) : (
                  <>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Firm Name</label>
                      <input
                        type="text"
                        name="firmName"
                        required
                        onChange={handleInputChange}
                        value={formData.firmName || ""}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Contact Person</label>
                      <input
                        type="text"
                        name="contactPerson"
                        required
                        onChange={handleInputChange}
                        value={formData.contactPerson || ""}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Company Size</label>
                      <select
                        name="companySize"
                        required
                        onChange={handleInputChange}
                        value={formData.companySize || "1-10"}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                      >
                        {["1-10", "11-50", "51-200", "201-500", "500+"].map((size) => (
                          <option key={size} value={size}>
                            {size} employees
                          </option>
                        ))}
                      </select>
                    </div>
                  </>
                )}

                {["email", "phone"].map((field) => (
                  <div key={field}>
                    <label className="block text-sm font-medium text-gray-700 capitalize">{field}</label>
                    <input
                      type={field === "email" ? "email" : "tel"}
                      name={field}
                      required
                      onChange={handleInputChange}
                      value={formData[field] || ""}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    />
                  </div>
                ))}

                <div>
                  <label className="block text-sm font-medium text-gray-700">Consultation Type</label>
                  <select
                    name="consultationType"
                    required
                    onChange={handleInputChange}
                    value={formData.consultationType || ""}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  >
                    <option value="">Select Type</option>
                    {["Tax", "Audit", "Compliance", "Other"].map((type) => (
                      <option key={type} value={type}>
                        {type}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Preferred Date</label>
                  <input
                    type="date"
                    name="preferredDate"
                    required
                    onChange={handleInputChange}
                    value={formData.preferredDate || ""}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Message (Optional)</label>
                  <textarea
                    name="message"
                    rows={4}
                    onChange={handleInputChange}
                    value={formData.message || ""}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  ></textarea>
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className={`w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors ${
                    isSubmitting ? "opacity-50 cursor-not-allowed" : ""
                  }`}
                >
                  {isSubmitting ? "Submitting..." : "Book Consultation"}
                </button>
              </form>
            </div>
          </div>

          <div className="lg:w-1/3 space-y-8">
            <div className="bg-white shadow-sm border border-gray-200 rounded-lg p-6">
              <h2 className="text-xl font-semibold mb-4">Contact Information</h2>
              <div className="space-y-2">
                <p>
                  <strong>Email:</strong> support@example.com
                </p>
                <p>
                  <strong>Phone:</strong> +1 234 567 8900
                </p>
                <p>
                  <strong>Address:</strong> 123 Business St, City, State 12345
                </p>
              </div>
            </div>

            <div className="bg-white shadow-sm border border-gray-200 rounded-lg p-6">
              <h2 className="text-xl font-semibold mb-4">Frequently Asked Questions</h2>
              <div className="space-y-4">
                <div>
                  <h3 className="font-medium">What services do you offer?</h3>
                  <p className="text-gray-600">
                    We offer a wide range of services including tax planning, audit assistance, and compliance
                    consulting.
                  </p>
                </div>
                <div>
                  <h3 className="font-medium">How long does a consultation typically last?</h3>
                  <p className="text-gray-600">
                    Initial consultations usually last about 30 minutes to an hour, depending on the complexity of your
                    needs.
                  </p>
                </div>
                <div>
                  <h3 className="font-medium">Do you offer virtual consultations?</h3>
                  <p className="text-gray-600">
                    Yes, we offer both in-person and virtual consultations to accommodate your preferences and schedule.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

