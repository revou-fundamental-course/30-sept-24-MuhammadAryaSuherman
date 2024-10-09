document.addEventListener('DOMContentLoaded', function () {
    const form = document.getElementById('temperatureForm');
    const resultDiv = document.getElementById('result');
    const conversionResultDiv = document.getElementById('conversionResult');
    const explanationDiv = document.getElementById('explanation');

    form.addEventListener('submit', function (e) {
        e.preventDefault();
        const temperature = parseFloat(document.getElementById('temperatureInput').value);
        const fromUnit = document.getElementById('fromUnit').value;

        if (isNaN(temperature)) {
            alert('Masukkan suhu yang valid!');
            return;
        }

        const conversions = convertTemperature(temperature, fromUnit);
        displayResults(temperature, fromUnit, conversions);
    });

    function convertTemperature(temp, from) {
        let celsius, fahrenheit, kelvin;

        switch (from) {
            case 'celsius':
                celsius = temp;
                fahrenheit = (temp * 9 / 5) + 32;
                kelvin = temp + 273.15;
                break;
            case 'fahrenheit':
                celsius = (temp - 32) * 5 / 9;
                fahrenheit = temp;
                kelvin = (temp - 32) * 5 / 9 + 273.15;
                break;
            case 'kelvin':
                celsius = temp - 273.15;
                fahrenheit = (temp - 273.15) * 9 / 5 + 32;
                kelvin = temp;
                break;
        }

        return { celsius, fahrenheit, kelvin };
    }

    function displayResults(originalTemp, fromUnit, conversions) {
        const unitSymbols = {
            celsius: '°C',
            fahrenheit: '°F',
            kelvin: 'K'
        };

        for (const [unit, value] of Object.entries(conversions)) {
            if (unit !== fromUnit) {
                const resultItem = document.createElement('div');
                resultItem.className = 'result-item mb-3 text-gray-600 mt-1';
                resultItem.innerHTML = `
                    <div class="flex items-center">
                        <span class="text-2xl mr-2">${getTemperatureIcon(value, unit)}</span>
                        <div>
                            <div class="font-medium">${originalTemp}${unitSymbols[fromUnit]} = ${value.toFixed(2)}${unitSymbols[unit]}</div>
                            <div class="text-sm text-gray-600 mt-1">${getTemperatureDescription(value, unit)}</div>
                            <div class="text-sm text-gray-600 mt-1">${getConversionFormula(originalTemp, fromUnit, unit, value)}</div>
                        </div>
                    </div>
                `;
                conversionResultDiv.appendChild(resultItem);
            }
        }

        explanationDiv.innerHTML = `
            <h3 class="text-lg font-semibold mb-2">Penjelasan Detail:</h3>
            ${getDetailedExplanation(originalTemp, fromUnit, conversions)}
        `;

        resultDiv.classList.remove('hidden');
    }

    function getTemperatureIcon(temp, unit) {
        let celsius = unit === 'celsius' ? temp : unit === 'fahrenheit' ? (temp - 32) * 5 / 9 : temp - 273.15;
        if (celsius < 0) return '❄️';
        if (celsius < 10) return '🌡️';
        if (celsius < 20) return '🍃';
        if (celsius < 30) return '☀️';
        return '🔥';
    }

    function getTemperatureDescription(temp, unit) {
        let celsius = unit === 'celsius' ? temp : unit === 'fahrenheit' ? (temp - 32) * 5 / 9 : temp - 273.15;
        if (celsius < 0) return 'Sangat dingin';
        if (celsius < 10) return 'Dingin';
        if (celsius < 20) return 'Sejuk';
        if (celsius < 30) return 'Hangat';
        return 'Panas';
    }

    function getConversionFormula(originalTemp, fromUnit, toUnit, result) {
        const formulas = {
            celsiusTofahrenheit: `(${originalTemp}°C × 9/5) + 32 = ${result.toFixed(2)}°F`,
            celsiusTokelvin: `${originalTemp}°C + 273.15 = ${result.toFixed(2)}K`,
            fahrenheitTocelsius: `(${originalTemp}°F - 32) × 5/9 = ${result.toFixed(2)}°C`,
            fahrenheitTokelvin: `(${originalTemp}°F - 32) × 5/9 + 273.15 = ${result.toFixed(2)}K`,
            kelvinTocelsius: `${originalTemp}K - 273.15 = ${result.toFixed(2)}°C`,
            kelvinTofahrenheit: `(${originalTemp}K - 273.15) × 9/5 + 32 = ${result.toFixed(2)}°F`
        };

        const key = fromUnit.toLowerCase() + 'To' + toUnit.toLowerCase();
        return `Rumus: ${formulas[key]}`;
    }


    function getDetailedExplanation(originalTemp, fromUnit, conversions) {
        const { celsius, fahrenheit, kelvin } = conversions;
        let explanation = '';

        // Penjelasan rumus konversi
        explanation += '<h4 class="font-semibold mt-3 mb-2">Rumus Konversi:</h4>';
        explanation += '<ul>';
        if (fromUnit !== 'celsius') {
            explanation += `<li>Celsius: ${getConversionFormula(originalTemp, fromUnit, 'celsius', celsius)}</li>`;
        }
        if (fromUnit !== 'fahrenheit') {
            explanation += `<li>Fahrenheit: ${getConversionFormula(originalTemp, fromUnit, 'fahrenheit', fahrenheit)}</li>`;
        }
        if (fromUnit !== 'kelvin') {
            explanation += `<li>Kelvin: ${getConversionFormula(originalTemp, fromUnit, 'kelvin', kelvin)}</li>`;
        }
        explanation += '</ul>';

        // Keadaan Air
        explanation += '<h4 class="font-semibold mt-3 mb-2">Keadaan Air:</h4>';
        if (celsius <= 0) {
            explanation += `<p>Pada suhu ${originalTemp}${fromUnit}, air akan membeku. Es terbentuk pada suhu 0°C (32°F, 273.15K) atau di bawahnya.</p>`;
        } else if (celsius >= 100) {
            explanation += `<p>Pada suhu ${originalTemp}${fromUnit}, air akan mendidih dan berubah menjadi uap. Air mendidih pada suhu 100°C (212°F, 373.15K) atau di atasnya pada tekanan atmosfer standar.</p>`;
        } else {
            explanation += `<p>Pada suhu ${originalTemp}${fromUnit}, air akan berada dalam bentuk cair. Air tetap cair antara 0°C dan 100°C (32°F dan 212°F, 273.15K dan 373.15K) pada tekanan atmosfer standar.</p>`;
        }

        // Perbandingan dengan suhu tubuh manusia
        explanation += '<h4 class="font-semibold mt-3 mb-2">Perbandingan dengan Suhu Tubuh Manusia:</h4>';
        const bodyTempDiff = celsius - 37;
        explanation += `<p>Suhu ini ${Math.abs(bodyTempDiff).toFixed(1)}°C ${bodyTempDiff > 0 ? 'lebih tinggi' : 'lebih rendah'} dari suhu tubuh manusia normal (37°C, 98.6°F, 310.15K). `;
        if (Math.abs(bodyTempDiff) > 5) {
            explanation += `Ini adalah perbedaan yang signifikan dan bisa terasa ${bodyTempDiff > 0 ? 'sangat panas' : 'sangat dingin'} bagi tubuh manusia.</p>`;
        } else {
            explanation += `Ini adalah perbedaan yang relatif kecil dan mungkin masih terasa nyaman bagi sebagian orang.</p>`;
        }

        // contoh sehari-hari
        explanation += '<h4 class="font-semibold mt-3 mb-2">Contoh dalam Kehidupan Sehari-hari:</h4><ul>';
        if (celsius < 0) {
            explanation += '<li>Suhu ini di bawah titik beku air. Ini bisa dibandingkan dengan suhu di dalam freezer rumah tangga yang biasanya diatur sekitar -18°C (0°F).</li>';
        } else if (celsius < 10) {
            explanation += '<li>Suhu ini mirip dengan suhu di dalam kulkas yang biasanya diatur antara 1°C hingga 5°C (34°F hingga 41°F).</li>';
        } else if (celsius < 20) {
            explanation += '<li>Suhu ini mirip dengan suhu ruangan yang nyaman di musim dingin, sekitar 20°C (68°F).</li>';
        } else if (celsius < 30) {
            explanation += '<li>Suhu ini mirip dengan suhu ruangan yang nyaman di musim panas, sekitar 24°C (75°F).</li>';
        } else {
            explanation += '<li>Suhu ini di atas suhu ruangan normal. Ini bisa dibandingkan dengan hari yang sangat panas di musim panas.</li>';
        }
        explanation += '</ul>';

        return explanation;
    }
});