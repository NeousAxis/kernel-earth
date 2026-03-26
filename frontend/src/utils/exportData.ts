export const downloadCSV = (data: any, countryCode: string) => {
  const headers = ['Date', 'Psy_brut_z', 'Psy_res', 'Atm', 'Beh'];
  const rows = data.dates.map((date: string, i: number) => [
    date,
    data.psy_brut[i],
    data.psy_res[i],
    data.atm[i],
    data.beh[i]
  ]);

  const csvContent = [
    headers.join(','),
    ...rows.map((row: any[]) => row.join(','))
  ].join('\n');

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  link.setAttribute('href', url);
  link.setAttribute('download', `climate_data_${countryCode}.csv`);
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

export const downloadJSON = (data: any, countryCode: string) => {
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  link.setAttribute('href', url);
  link.setAttribute('download', `climate_data_${countryCode}.json`);
  link.click();
};
