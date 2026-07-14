export function LabelField({ text, textColor, textSize, otherCss, type, name, value, placeholder, ...prop }) {
    return (
        <>

            {type === "textarea" ?
                (
                    <label className={`flex flex-col gap-2 ${textSize} font-semibold ${textColor}`}>
                        {text}
                        <textarea
                            {...prop}
                            className={`w-full text-base py-2 px-3 focus:outline-none focus:ring-2 rounded-lg ${otherCss}`}
                            placeholder={placeholder}
                            name={name}
                            value={value}
                        />
                    </label>
                ) : (
                    <label className={`flex flex-col gap-2 ${textSize} font-semibold ${textColor}`}>
                        {text}
                        <input
                            {...prop}
                            className={`w-full text-base py-2 px-3 focus:outline-none focus:ring-2 rounded-lg ${otherCss}`}
                            type={type}
                            placeholder={placeholder}
                            name={name}
                            value={value}
                        />
                    </label>
                )

            }

        </>
    )
}