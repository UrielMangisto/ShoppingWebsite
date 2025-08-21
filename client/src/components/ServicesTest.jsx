import React, { useState, useEffect } from 'react'
import services from '../services-functional'

function ServicesTest() {
  const [results, setResults] = useState([])
  const [loading, setLoading] = useState(false)

  const addResult = (message, type = 'info') => {
    const timestamp = new Date().toLocaleTimeString('he-IL')
    setResults(prev => [...prev, { message, type, timestamp }])
  }

  const testUtils = () => {
    addResult('🔧 בודק כלי עזר...', 'info')
    
    const price1 = services.utils.formatPrice(123.45)
    const price2 = services.utils.formatPrice(null)
    const date1 = services.utils.formatDate(new Date().toISOString())
    
    addResult(`מחיר 123.45: ${price1}`, 'info')
    addResult(`מחיר null: ${price2}`, 'info')
    addResult(`תאריך עכשיו: ${date1}`, 'info')
    addResult('✅ כלי עזר עובדים!', 'success')
  }

  const testProducts = async () => {
    setLoading(true)
    addResult('🛍️ בודק מוצרים...', 'info')
    
    try {
      const result = await services.products.getAllProducts({ page: 1, limit: 3 })
      
      if (result.success) {
        addResult(`✅ נטענו ${result.data.length} מוצרים!`, 'success')
        
        if (result.data.length > 0) {
          const product = result.data[0]
          addResult(`מוצר ראשון: ${product.name} - ${services.utils.formatPrice(product.price)}`, 'info')
        }
      } else {
        addResult(`❌ שגיאה: ${result.error}`, 'error')
      }
    } catch (error) {
      addResult(`❌ שגיאת רשת: ${error.message}`, 'error')
    }
    
    setLoading(false)
  }

  const testCategories = async () => {
    setLoading(true)
    addResult('📂 בודק קטגוריות...', 'info')
    
    try {
      const result = await services.categories.getAllCategories()
      
      if (result.success) {
        addResult(`✅ נטענו ${result.data.length} קטגוריות!`, 'success')
        
        if (result.data.length > 0) {
          const names = result.data.slice(0, 3).map(c => c.name).join(', ')
          addResult(`קטגוריות: ${names}`, 'info')
        }
      } else {
        addResult(`❌ שגיאה: ${result.error}`, 'error')
      }
    } catch (error) {
      addResult(`❌ שגיאת רשת: ${error.message}`, 'error')
    }
    
    setLoading(false)
  }

  const runAllTests = async () => {
    setResults([])
    addResult('🚀 מתחיל בדיקה מלאה...', 'info')
    
    testUtils()
    await new Promise(resolve => setTimeout(resolve, 500))
    
    await testProducts()
    await new Promise(resolve => setTimeout(resolve, 500))
    
    await testCategories()
    
    addResult('🏁 בדיקה הושלמה!', 'success')
  }

  useEffect(() => {
    addResult('📦 רכיב בדיקת שירותים נטען', 'info')
    addResult(`🔧 שירותים זמינים: ${Object.keys(services).join(', ')}`, 'info')
  }, [])

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      <h2>🧪 בדיקת Services Functional</h2>
      
      <div style={{ marginBottom: '20px' }}>
        <button 
          onClick={testUtils}
          style={{ margin: '5px', padding: '10px', background: '#007bff', color: 'white', border: 'none', borderRadius: '4px' }}
        >
          בדוק כלי עזר
        </button>
        
        <button 
          onClick={testProducts}
          disabled={loading}
          style={{ margin: '5px', padding: '10px', background: '#28a745', color: 'white', border: 'none', borderRadius: '4px' }}
        >
          בדוק מוצרים
        </button>
        
        <button 
          onClick={testCategories}
          disabled={loading}
          style={{ margin: '5px', padding: '10px', background: '#17a2b8', color: 'white', border: 'none', borderRadius: '4px' }}
        >
          בדוק קטגוריות
        </button>
        
        <button 
          onClick={runAllTests}
          disabled={loading}
          style={{ margin: '5px', padding: '10px', background: '#6f42c1', color: 'white', border: 'none', borderRadius: '4px' }}
        >
          הרץ הכל
        </button>
        
        <button 
          onClick={() => setResults([])}
          style={{ margin: '5px', padding: '10px', background: '#6c757d', color: 'white', border: 'none', borderRadius: '4px' }}
        >
          נקה
        </button>
      </div>

      {loading && <div style={{ color: '#007bff' }}>⏳ טוען...</div>}

      <div style={{ 
        background: '#f8f9fa', 
        padding: '15px', 
        borderRadius: '4px', 
        maxHeight: '400px', 
        overflowY: 'auto',
        fontFamily: 'monospace',
        fontSize: '14px'
      }}>
        {results.length === 0 ? (
          <div>לחץ על כפתור לבדיקה...</div>
        ) : (
          results.map((result, index) => (
            <div key={index} style={{ 
              margin: '5px 0',
              color: result.type === 'success' ? '#28a745' : 
                     result.type === 'error' ? '#dc3545' : 
                     '#6c757d'
            }}>
              [{result.timestamp}] {result.message}
            </div>
          ))
        )}
      </div>

      <div style={{ marginTop: '20px', fontSize: '12px', color: '#6c757d' }}>
        <strong>טיפ:</strong> פתח את הקונסול (F12) כדי לראות פרטים נוספים ולהשתמש ב-services ידנית.
      </div>
    </div>
  )
}

export default ServicesTest
