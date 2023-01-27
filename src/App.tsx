import { useState, useEffect, useRef } from 'react'
import Select from './components/Select'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCopy, faSnowflake } from '@fortawesome/free-regular-svg-icons'
import { faCheck, faRotate, faCat } from '@fortawesome/free-solid-svg-icons'
import ButtonWithIcon from './components/ButtonWithIcon'

interface IExcuse {
  id: number;
  excuse: string;
  category: string;
}

export default function App() {
  const [excuse, setExcuse] = useState<IExcuse | null>(null);
  const [isTextCopied, setIsTextCopied] = useState<React.ReactNode>(<ButtonWithIcon btnText='Copy' icon={faCopy} iconClasses={'text-orange-400'} />)
  const [isError, setIsError] = useState(false)
  const [category, setCategory] = useState('')
  const [isLoading, setIsLoading] = useState(true)

  const excuseTextRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const controller = new AbortController()
    const signal = controller.signal
    fetchExcuse(category, signal)

    return () => {
      controller.abort()
    }
  }, [category])

  useEffect(() => {
    setIsLoading(true)
    setIsError(false)
    setIsTextCopied(<ButtonWithIcon btnText='Copy' icon={faCopy} iconClasses={'text-orange-400'} />)
  }, [])

  async function fetchExcuse(category: string, signal?: AbortSignal) {
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
        setIsTextCopied(<ButtonWithIcon btnText='Copying' icon={faRotate} iconClasses='fa-spin text-blue-400' />)
        setTimeout(() => setIsTextCopied(<ButtonWithIcon btnText='Copied' icon={faCheck} iconClasses='text-green-400' />), 500)
        setTimeout(() => setIsTextCopied(<ButtonWithIcon btnText='Copy' icon={faCopy} iconClasses='text-orange-400' />), 1000)
      }
    } catch (copiedText) {
      console.error('Error while copying')
    }
  }

  function handleSelectCategory(category: string) {
    setCategory(category)
  }

  return (
    <div className=' flex flex-col gap-4 text-sm xs:text-md sm:text-base'>
      <div className='flex gap-3 items-start justify-between'>
        <Select handleSelectCategory={handleSelectCategory} />
        <button className='text-gray-100 hover:bg-gray-700 px-3 py-2 rounded bg-gray-800 outline-1 outline-gray-300 outline-offset-2' onClick={() => fetchExcuse(category)}>
          Find Another
        </button>
        {isError && <div className='px-3 py-2 border rounded text-xs xs:text-sm text-white border-red-600'>
          Sorry, Couldn't fetch excuse!
        </div>}
      </div>
      <div className='flex flex-col justify-between gap-3 px-4 py-2 rounded-xl bg-slate-900/[.87] text-gray-100'>
        {isLoading ?
          <span className='pl-2 py-2 font-thin'>Loading excuse...</span>
          :
          (isError ? <span className='text-red-500'>Failed</span>
            : <div className='flex flex-row gap-4 justify-between items-center'>
              {category ?
                <span className='text-gray-400 px-2 py-2 xs:px-4 xs:py-2 '>
                  Done
                  <FontAwesomeIcon className='animate-cat-fade-in ml-1 text-orange-500 opacity-90' icon={faCat} />
                </span>
                : <span className='text-teal-100 pl-2 py-2 break-words '>Here's a random excuse for you!<FontAwesomeIcon className='ml-2 fa-spin' icon={faSnowflake} /></span>}

              {excuse && <div onClick={copyExcuse}>{isTextCopied}</div>}
            </div>)
        }
        <div className='border border-gray-600 grid p-2 items-center gap-x-4 rounded'>
          <div className='pl-2'>
            <p className={`${isLoading && 'animate-pulse'} font-semibold text-teal-100`} ref={excuseTextRef}>{ (isLoading && 'Patience...') || (isError && 'Awh snap...') || excuse?.excuse}</p>
          </div>
        </div>

        <div className='flex items-center gap-1 justify-end text-xs xs:text-sm'>
          <span className='text-gray-300 font-thin'>From Category:</span>
          {isLoading ? <span className='text-orange-400'>Loading</span> : (isError ? <span className='text-red-500'>Error</span> : <span className='capitalize text-green-400'>{excuse?.category}</span>)}
        </div>

      </div>
    </div>
  );
}
