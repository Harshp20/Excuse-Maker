interface IMessageProps {
    check: boolean
    text: string
}

export default function Message ({ check, text }: IMessageProps) {
    return check ? <span>{ text }</span> : <></>
}