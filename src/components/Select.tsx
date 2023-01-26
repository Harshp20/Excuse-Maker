type SelectProp = { handleSelectCategory: (val: string) => void }

const options = [
    { text: 'Family', value: 'family'},
    { text: 'Office', value: 'office'},
    { text: 'Children', value: 'children'},
    { text: 'College', value: 'college'},
    { text: 'Party', value: 'party'},
    { text: 'Funny', value: 'funny'},
    { text: 'Unbelievable', value: 'unbelievable'},
    { text: 'Developers', value: 'developers'},
    { text: 'Gaming', value: 'gaming'}
]

export default function Select ({ handleSelectCategory }: SelectProp) {
    return (
        <select
            className="bg-gray-300 rounded-sm px-3 py-3 sm:px-4 cursor-pointer appearance-none hover:bg-gray-200 active:bg-gray-300 outline-slate-500 outline-offset-2" 
            defaultValue={''}
            onChange={(e) => handleSelectCategory(e.target.value)}>
            <option value={''} disabled hidden>Select Category</option>
            {options.map(option => <option key={option.value} value={option.value}>{option.text}</option>)}
        </select>
    )
}