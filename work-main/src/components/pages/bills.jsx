import React, { useEffect, useState } from 'react'

export default function Bills() {
  const API_BASE = import.meta.env.VITE_API_BASE ?? 'http://127.0.0.1:8000'
  const [bills, setBills] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  useEffect(() => {
    let mounted = true
    const load = async () => {
      setLoading(true)
      try {
        const res = await fetch(`${API_BASE}/bills/`)
        if (!res.ok) throw new Error('Failed to load bills')
        const data = await res.json()
        if (mounted) setBills(data || [])
      } catch (err) {
        if (mounted) setError(String(err))
      } finally {
        if (mounted) setLoading(false)
      }
    }
    load()
    return () => (mounted = false)
  }, [])

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Bills</h1>
      {loading && <div>Loading...</div>}
      {error && <div className="text-red-600">{error}</div>}
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white">
          <thead>
            <tr>
              <th className="px-4 py-2">Bill ID</th>
              <th className="px-4 py-2">Date</th>
              <th className="px-4 py-2">Bill Type</th>
              <th className="px-4 py-2">Amount</th>
              <th className="px-4 py-2">Payment Method</th>
              <th className="px-4 py-2">Transaction ID</th>
              <th className="px-4 py-2">Paid Date</th>
              <th className="px-4 py-2">Discount</th>
              <th className="px-4 py-2">Balance</th>
              <th className="px-4 py-2">Status</th>
            </tr>
          </thead>
          <tbody>
            {bills.map((b) => (
              <tr key={b.id} className="border-t">
                <td className="px-4 py-2">{b.bill_id}</td>
                <td className="px-4 py-2">{b.date}</td>
                <td className="px-4 py-2">{b.bill_type}</td>
                <td className="px-4 py-2">{b.amount}</td>
                <td className="px-4 py-2">{b.payment_method}</td>
                <td className="px-4 py-2">{b.transaction_id}</td>
                <td className="px-4 py-2">{b.paid_date}</td>
                <td className="px-4 py-2">{b.discount}</td>
                <td className="px-4 py-2">{b.balance}</td>
                <td className="px-4 py-2">{b.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
