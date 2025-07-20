export function formatToDateAndTime(isoDate?: string) {
  if (!isoDate) {
    return <>N/A</>;
  }

  const date = new Date(isoDate);
  // Extract parts of the date
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are 0-indexed
  const year = date.getFullYear();
  // Extract parts of the time
  let hours = date.getHours();
  const minutes = String(date.getMinutes()).padStart(2, '0');
  const period = hours >= 12 ? 'PM' : 'AM';
  hours = hours % 12 || 12; // Convert to 12-hour format, 0 becomes 12

  // Return as JSX with wrapping
  return (
    <>
      {`${day}-${month}-${year}`} {/* <br /> */}
      {`${hours}:${minutes} ${period}`}
    </>
  );
}