import { useEffect, useState } from 'react'
import axios from 'axios'
import { toast } from 'react-toastify'
import './Report.css'

const requestReport = (url, token, from, to) => axios.get(`${url}/api/report/summary`, {
  headers: { token },
  params: { from, to },
})

const Report = ({ url, token }) => {
  const [dates, setDates] = useState(() => {
    const today = new Date(Date.now() + 330 * 60 * 1000)
    const from = new Date(today.getTime() - 29 * 24 * 60 * 60 * 1000)
    return { from: from.toISOString().slice(0, 10), to: today.toISOString().slice(0, 10) }
  })
  const [report, setReport] = useState(null)

  const fetchReport = async (from = dates.from, to = dates.to) => {
    try {
      const response = await requestReport(url, token, from, to)
      if (response.data.success) {
        setReport(response.data.data)
      } else {
        toast.error('Could not generate sales report')
      }
    } catch {
      toast.error('Could not generate sales report')
    }
  }

  useEffect(() => {
    let active = true
    requestReport(url, token, dates.from, dates.to)
      .then((response) => {
        if (!active) return
        if (response.data.success) {
          setReport(response.data.data)
        } else {
          toast.error('Could not generate sales report')
        }
      })
      .catch(() => {
        if (active) toast.error('Could not generate sales report')
      })
    return () => { active = false }
  }, [url, token, dates.from, dates.to])

  const amount = (value) => `₹${Number(value || 0).toFixed(2)}`
  const downloadCsv = () => {
    if (!report) return

    const rows = [
      ['Section', 'Item / Date', 'Quantity / Orders', 'Sales / Value'],

      ['Report', `Date range: ${dates.from} to ${dates.to}`, '', ''],

      ['Summary', 'Total orders', report.summary.totalOrders, ''],

      ['Summary', 'Total sales', '', `Rs ${report.summary.totalSales.toFixed(2)}`],

      ['Summary', 'Items sold', report.summary.itemsSold, ''],

      ['Summary', 'Average order value', '', `Rs ${report.summary.avgOrderValue.toFixed(2)}`],
      ...Object.entries(report.byStatus).map(([status, count]) => ['Orders by status', status, count, '']),
      ...report.topItems.map((item) => ['Top 5 items', item.name, item.quantity, `Rs ${item.sales.toFixed(2)}`]),
      ...report.byCategory.map((item) => ['Sales by category', item.category, item.quantity, `Rs ${item.sales.toFixed(2)}`]),
      ['Mystery Bag summary', 'Bags sold', report.mystery.bagsSold, ''],
      ['Mystery Bag summary', 'Sales', '', `Rs ${report.mystery.sales.toFixed(2)}`],
      ['Mystery Bag summary', 'Customer savings', '', `Rs ${report.mystery.savings.toFixed(2)}`],
      ...report.daily.map((item) => [
        'Daily sales',
        `Date ${item.date}`,
        item.orders,
        `Rs ${item.sales.toFixed(2)}`,
      ]),
    ]
    const csv = rows.map((row) => row.map((cell) => {
      const value = String(cell ?? '')
      return `"${value.replace(/"/g, '""')}"`
    }).join(',')).join('\r\n')
    const link = document.createElement('a')
    link.href = URL.createObjectURL(new Blob([`\uFEFF${csv}`], { type: 'text/csv;charset=utf-8' }))
    link.download = `sales-report-${dates.from}-to-${dates.to}.csv`
    link.click()
    setTimeout(() => URL.revokeObjectURL(link.href), 0)
  }

  return (
    <div className='report add flex-col'>
      <h3>Sales Report</h3>
      <div className='report-controls'>
        <label>From <input type='date' value={dates.from} onChange={(event) => setDates({ ...dates, from: event.target.value })} /></label>
        <label>To <input type='date' value={dates.to} onChange={(event) => setDates({ ...dates, to: event.target.value })} /></label>
        <button className='add-button' onClick={() => fetchReport()}>Generate</button>
        <button className='add-button' onClick={() => window.print()}>Save PDF</button>
        <button className='add-button' onClick={downloadCsv}>Download CSV</button>
      </div>
      {!report ? null : report.summary.totalOrders === 0 ? (
        <p>No orders found</p>
      ) : (
        <div className='report-results'>
          <section className='report-section'>
            <b>Summary</b>
            <p>Total orders: {report.summary.totalOrders}</p>
            <p>Total sales: {amount(report.summary.totalSales)}</p>
            <p>Items sold: {report.summary.itemsSold}</p>
            <p>Average order value: {amount(report.summary.avgOrderValue)}</p>
          </section>
          <section className='report-section'>
            <b>Orders by status</b>
            <table>
              <thead><tr><th>Status</th><th>Orders</th></tr></thead>
              <tbody>{Object.entries(report.byStatus).map(([status, count]) => <tr key={status}><td>{status}</td><td>{count}</td></tr>)}</tbody>
            </table>
          </section>
          <section className='report-section'>
            <b>Top 5 items</b>
            <table>
              <thead><tr><th>Item</th><th>Quantity</th><th>Sales</th></tr></thead>
              <tbody>{report.topItems.map((item) => <tr key={item.name}><td>{item.name}</td><td>{item.quantity}</td><td>{amount(item.sales)}</td></tr>)}</tbody>
            </table>
          </section>
          <section className='report-section'>
            <b>Sales by category</b>
            <table>
              <thead><tr><th>Category</th><th>Quantity</th><th>Sales</th></tr></thead>
              <tbody>{report.byCategory.map((item) => <tr key={item.category}><td>{item.category}</td><td>{item.quantity}</td><td>{amount(item.sales)}</td></tr>)}</tbody>
            </table>
          </section>
          <section className='report-section'>
            <b>Mystery Bag summary</b>
            <p>Bags sold: {report.mystery.bagsSold}</p>
            <p>Sales: {amount(report.mystery.sales)}</p>
            <p>Customer savings: {amount(report.mystery.savings)}</p>
          </section>
          <section className='report-section'>
            <b>Daily sales</b>
            <table>
              <thead><tr><th>Date</th><th>Orders</th><th>Sales</th></tr></thead>
              <tbody>{report.daily.map((item) => <tr key={item.date}><td>{item.date}</td><td>{item.orders}</td><td>{amount(item.sales)}</td></tr>)}</tbody>
            </table>
          </section>
        </div>
      )}
    </div>
  )
}

export default Report
