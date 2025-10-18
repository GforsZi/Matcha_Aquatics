// src/utils/date.ts
import dayjs from 'dayjs';
import 'dayjs/locale/id';

dayjs.locale('id');

/**
 * Format tanggal dari Laravel ke format lokal.
 * @param dateString - Nilai tanggal dari API (contoh: "2025-10-07 09:00:00")
 * @returns string - Tanggal terformat (contoh: "7 Okt 2025, 09.00") atau "-" jika null
 */
export const formatDate = (dateString?: Date | null): string => {
    if (!dateString) return '-';
    return dayjs(dateString).format('D MMM YYYY, HH:mm');
};
