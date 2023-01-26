import { useState, useEffect, useRef } from 'react'
import Select from './components/Select'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCopy, faSnowflake } from '@fortawesome/free-regular-svg-icons'
import { faCheck, faRotate, faCat } from '@fortawesome/free-solid-svg-icons'
interface IExcuse {
  id: number;
  excuse: string;
  category: string;
}

export default function App() {
  const [excuse, setExcuse] = useState<IExcuse | null>(null);
  const [isTextCopied, setIsTextCopied] = useState(getDefaultCopyBtnText())
  const [isError, setIsError] = useState(false)
  const [category, setCategory] = useState('')
  const [isLoading, setIsLoading] = useState(true)

  const excuseTextRef = useRef<HTMLDivElement>(null)
  const copyBtnRef = useRef<HTMLButtonElement>(null)

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
        setIsTextCopied(getCopyProgressStatus())
        setTimeout(() => setIsTextCopied(getSuccessCopyBtnText()), 500)
        setTimeout(() => setIsTextCopied(getDefaultCopyBtnText()), 1000)
      }
    } catch (copiedText) {
      console.error('Error while copying')
    }
  }

  function handleSelectCategory(category: string) {
    setCategory(category)
  }

  function getDefaultCopyBtnText() {
    return (<>
      <span>Copy</span>
      <FontAwesomeIcon className='ml-2 text-xs xs:text-sm text-orange-400' icon={faCopy} />
    </>)
  }

  function getSuccessCopyBtnText() {
    return (<>
      <span>Copied</span>
      <FontAwesomeIcon className='ml-2 text-xs xs:text-sm text-green-400' icon={faCheck} />
    </>)
  }

  function getCopyProgressStatus() {
    return (<>
      <span>Copying</span>
      <FontAwesomeIcon className='fa-spin ml-2 text-xs xs:text-sm text-blue-400' icon={faRotate} />
    </>)
  }

  return (
    <div className=' flex flex-col gap-4'>
      <div className='flex gap-3 items-start'>
        <Select handleSelectCategory={handleSelectCategory} />
        <button className='text-gray-100 hover:bg-gray-700 px-3 py-3 sm:px-4 text-xs sm:text-sm rounded-sm bg-gray-800 outline-1 outline-gray-300 outline-offset-2' onClick={() => fetchExcuse(category)}>
          Find Another
        </button>
        {isError && <div className='px-2 sm:px-3 py-2 text-xs sm:text-sm w-fit border rounded text-white border-red-600'>
          Sorry, Couldn't fetch excuse!
        </div>}
      </div>
      <div className='flex flex-col justify-between gap-3 px-4 py-2 rounded-xl bg-slate-900 text-gray-100'>
        {isLoading ?
          <span className='pl-2 py-2 text-xs sm:text-sm font-thin'>Loading excuse...</span>
          :
          (<div className='flex flex-row justify-between items-center'>
            {category ?
              <span className='text-gray-400 px-2 py-2 sm:px-4 sm:py-2 text-xs sm:text-sm'>
                Done
                <FontAwesomeIcon className='animate-cat-fade-in ml-1 text-orange-500 opacity-90' icon={faCat} />
              </span>
              :
              <span className='text-teal-100 pl-2 py-2 max-w-60 w-9/10 text-xs sm:text-sm'>Here's a random excuse for you!<FontAwesomeIcon className='ml-2 fa-spin' icon={faSnowflake} /></span>}

            {excuse &&
              <button ref={copyBtnRef} className='hover:bg-gray-700 px-3 py-2 sm:px-4 sm:py-2 rounded bg-gray-800 text-xs sm:text-sm font-semibold' onClick={copyExcuse}>
                {isTextCopied}
              </button>
            }
          </div>)
        }
        <div className='border border-gray-600 grid p-2 items-center gap-x-4 rounded'>
          <div className='pl-2'>
            <p className={`${isLoading && 'animate-pulse'} text-xs sm:text-sm font-semibold text-teal-100`} ref={excuseTextRef}>{excuse?.excuse || 'Patience...'}</p>
          </div>
        </div>

        <div className='flex items-center gap-1 justify-end text-2xs sm:text-xs'>
          <span className='text-gray-300 font-thin text-2xs sm:text-xs'>From Category:</span>
          <span className='capitalize'>{excuse?.category || 'Loading'}</span>
        </div>

      </div>
    </div>
  );
}
