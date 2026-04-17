export const formatTime = (timeInMs) => {
    const minutes = Math.floor(timeInMs / 60000);
    const seconds = Math.floor((timeInMs % 60000) / 1000);
    const milliseconds = Math.floor((timeInMs % 1000) / 10);

    const formatMinutes = minutes.toString().padStart(2, '0');
    const formatSeconds = seconds.toString().padStart(2, '0');
    const formatMilliseconds = milliseconds.toString().padStart(2, '0');

    const divider = (
        <span className="inline-flex flex-col justify-center gap-[0.25em] mx-[0.1em]">
            <span className="rounded-full bg-current w-[0.15em] h-[0.15em]"></span>
            <span className="rounded-full bg-current w-[0.15em] h-[0.15em]"></span>
        </span>
    );

    const renderDigits = (timeStr) => (
        <span className="inline-flex items-center">
            <span className="w-[1ch] inline-block text-center">{timeStr[0]}</span>
            <span className="w-[1ch] inline-block text-center">{timeStr[1]}</span>
        </span>
    );

    return (
        <span className="inline-flex items-center">
            {renderDigits(formatMinutes)}
            {divider}
            {renderDigits(formatSeconds)}
            {divider}
            {renderDigits(formatMilliseconds)}
        </span>
    );
};
