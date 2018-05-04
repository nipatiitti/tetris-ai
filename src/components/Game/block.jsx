import React from 'react'

const Block = ({ state, text }) => {
    if (state === 1)
        return (
            <div className="gridElement fill">{text}</div>
        )

    return (
        <div className="gridElement nofill">{text}</div>
    )
}

export default Block