export default function formatDateFlexible(dateInput, { showTime = false, showWeekday = false } = {}) {
  if (!dateInput) return '';
  const date = new Date(dateInput);

  const options = {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    ...(showTime && { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
    ...(showWeekday && { weekday: 'long' }),
  };

  return date.toLocaleString('vi-VN', options);
}

