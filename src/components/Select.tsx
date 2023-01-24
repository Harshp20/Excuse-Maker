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
        <select defaultValue={''} onChange={(e) => handleSelectCategory(e.target.value)}>
            <option value={''} disabled hidden>Select a Category</option>
            {options.map(option => <option key={option.value} value={option.value}>{option.text}</option>)}
        </select>
    )
}