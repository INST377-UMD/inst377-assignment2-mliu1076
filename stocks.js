const polygonKey = 'TkTKGi7u5Vx5jqOtkZ9oYfrpBA3fyo0z';
const topFive = 'https://tradestie.com/api/v1/apps/reddit?date=2022-04-03';

const stockCommands = {
    'Lookup *ticker': (ticker) => {
        ticker = ticker.trim().toUpperCase();
        console.log(`Looking up your chosen stock: ${ticker}`);
        lookupStock(ticker);
        range = 30;
    },
};


window.onload = () => {
    if (annyang) {
        annyang.addCommands(stockCommands); // adds new stock command
    }
    getTopFiveStocks();
}
async function getTopFiveStocks() {
    try {
        const response = await fetch(topFive);
        if (!response.ok) {
            throw new Error(`Error: ${response.status} ${response.statusText}`);
        }
        const data = await response.json();
        const topFiveArray = data.slice(0, 5); // Assuming the API returns an array of stocks
        console.log(topFiveArray);

        // adds table elements and icons to the stock table
        const tableBody = document.getElementById('stock-table-area');
        tableBody.innerHTML = ''; // Clear existing rows
        var image = ''
        topFiveArray.forEach(stock => {
            const row = document.createElement('tr');
            if (stock.sentiment == 'Bullish') {
                image = 'https://cdn-icons-png.flaticon.com/512/6978/6978349.png'
            } else {
                image = 'https://cdn-icons-png.flaticon.com/512/6410/6410261.png'
            }
            row.innerHTML = `
                <td><a href='https://finance.yahoo.com/quote/${stock.ticker}'>${stock.ticker}</a></td>
                <td>${stock.no_of_comments}</td>
                <td><img src='${image}' style='width:200px'></td>
            `;
            tableBody.appendChild(row);
        });
    } catch (error) {
        console.error('Failed to fetch top 5 stocks from Tradestie:', error);
    }
}

async function lookupStock(ticker) {
    var range = parseInt(document.getElementById('day-number').value);
    //modifies dates to usable format
    let today = new Date();
    let fromDate = new Date();
    fromDate.setDate(today.getDate() - range);

    const format = d => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;

    today = format(today);
    fromDate = format(fromDate);

    polygonUrl = `https://api.polygon.io/v2/aggs/ticker/${ticker}/range/1/day/${fromDate}/${today}?adjusted=true&sort=asc&limit=120&apiKey=${polygonKey}`;
    try {
        const response = await fetch(polygonUrl);
        if (!response.ok) {
            throw new Error(`Error: ${response.status} ${response.statusText}`);
        }
        const data = await response.json();
        if (data.resultsCount == 0) {
            alert('No data found for the given ticker. Please try again.');
            return false;
        }

        const canvas = document.getElementById('my-chart').getContext('2d');
        clearChart();
        //modifies chart
        document.getElementById('chartDiv').style.display = 'block';
        canvas.chartInstance = new Chart(canvas, {
            type: 'line',
            data: {
                labels: Array.isArray(data.results) ? data.results.map((point) => {
                    const date = new Date(point.t);
                    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
                }).filter(date => date >= fromDate && date <= today) : [],
                datasets: [{
                    label: `($)Stock Prices`,
                    data: data.results
                        .filter(point => {
                            const date = new Date(point.t);
                            const formattedDate = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
                            return formattedDate >= fromDate && formattedDate <= today;
                        })
                        .map((point) => point.c),
                    borderColor: 'blue',
                    borderWidth: 2,
                    fill: false
                }]
            },
            options: {
                responsive: true,
                scales: {
                    x: {
                        title: {
                            display: true,
                            text: 'Date'
                        }
                    },
                    y: {
                        title: {
                            display: true,
                            text: 'Price'
                        }
                    }
                }
            }
        });
    } catch (error) {
        console.error('Failed to fetch data from Polygon:', error);
    }
    return false;
}

async function polygonLookup(event) {
    event.preventDefault();
    var ticker = document.getElementById('stock-input').value.trim().toUpperCase();
    var range = parseInt(document.getElementById('day-number').value);
    // converts dates from the chosen range to today
    const today = new Date();
    const fromDate = new Date(today);
    fromDate.setDate(today.getDate() - range);

    const format = (date) => date.toISOString().split('T')[0];

    const formattedToday = format(today);
    const formattedfromDate = format(fromDate);

    var polygonUrl = `https://api.polygon.io/v2/aggs/ticker/${ticker}/range/1/day/${formattedfromDate}/${formattedToday}?adjusted=true&sort=asc&limit=120&apiKey=${polygonKey}`;
    lookupStock(ticker);
}

function clearChart() {
    //destroys chart so the user can consecutivelly display them after button presses
    const canvas = document.getElementById('my-chart').getContext('2d');
    if (canvas.chartInstance) {
        canvas.chartInstance.destroy();
    }
}