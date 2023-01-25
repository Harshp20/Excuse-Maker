import { useState, useEffect, useRef } from 'react'
import Message from './components/Message';
import Select from './components/Select'

interface IExcuse {
  id: number;
  excuse: string;
  category: string;
}

export default function App() {
  const [excuse, setExcuse] = useState<IExcuse | null>(null);
  const [isTextCopied, setIsTextCopied] = useState(false)
  const [isError, setIsError] = useState(false)
  const [category, setCategory] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const excuseTextRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const controller = new AbortController()
    const signal = controller.signal
    fetchExcuse(category, signal)

    return () => {
      controller.abort()
    }
  }, [category])

  async function fetchExcuse (category: string, signal?: AbortSignal) {
    setIsLoading(true)
    await fetch(`https://excuser-three.vercel.app/v1/excuse/${category}`, { signal })
      .then(response => response.json())
      .then(data => {
        setExcuse(data[0])
        setIsError(false)
        setIsLoading(false)
      })
      .catch((error) => {
        console.error(error)
        setIsError(true)
        setIsLoading(false)
      })
  };

  async function copyExcuse() {
    const text = excuseTextRef.current?.textContent
    await navigator.clipboard.writeText(text as string);
    try {
      const copiedText = await navigator.clipboard.readText()
      if (copiedText === text) {
        setIsTextCopied(true)
        setTimeout(() => setIsTextCopied(false), 2000)
      }
    } catch (copiedText) {
      console.error('Error while copying')
    }
  }

  function handleSelectCategory (category: string) {
    setCategory(category)
  }

  return (
    <div className='bg-gray-600'>
      <Select handleSelectCategory={handleSelectCategory} />
      
      <button onClick={() => fetchExcuse(category)}>Find another Excuse</button>
      {excuse && <button onClick={copyExcuse}>Copy</button>}

      <Message check={isTextCopied} text={'Excuse copied!'} />
      <Message check={isError} text={'Could not fetch excuse'} />
      <Message check={isLoading} text={'Loading excuse...'} />
      
      {!isLoading && excuse && (
        <div>
          <Message check={!category} text={'Here\'s a random excuse for you!'} />
          <div ref={excuseTextRef}>{excuse.excuse}</div>
          <div style={{textTransform: 'capitalize'}}>From Category: {excuse.category}</div>
        </div>
      )}
    </div>
  );
}
