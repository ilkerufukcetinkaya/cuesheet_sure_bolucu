function distributeAndExport() {
    var totalTimeInput = document.getElementById('hours').value;
    var minutesInput = document.getElementById('minutes').value;
    var secondsInput = document.getElementById('seconds').value;

    var totalTimeInSeconds = parseInt(totalTimeInput) * 3600 + parseInt(minutesInput) * 60 + parseInt(secondsInput);
    var themeCount = parseInt(document.getElementById('themeCount').value);

    if (themeCount < 1 || isNaN(totalTimeInSeconds)) {
        alert('Lütfen geçerli bir süre ve tema adedi girin.');
        return;
    }

    var distributedTimes = distributeTime(totalTimeInSeconds, themeCount);
    var totalDistributedTime = distributedTimes.reduce((total, time) => total + time, 0);

    // Eğer dağıtılan toplam süre, girilen toplam süreye eşit değilse eksik olan süreyi paylaştır
    if (totalDistributedTime !== totalTimeInSeconds) {
        var remainingTime = totalTimeInSeconds - totalDistributedTime;
        var equalShare = Math.floor(remainingTime / themeCount);
        var extraTime = remainingTime % themeCount;

        for (var i = 0; i < extraTime; i++) {
            distributedTimes[i] += equalShare + 1;
        }

        for (var i = extraTime; i < themeCount; i++) {
            distributedTimes[i] += equalShare;
        }
    }

    var formattedTimes = formatSecondsToTime(distributedTimes);
    exportToCSV(formattedTimes);
}

function distributeTime(totalTimeInSeconds, themeCount) {
    var distributedTimes = [];
    var remainingTime = totalTimeInSeconds;

    var maxTime = Math.min(600, Math.floor(totalTimeInSeconds / themeCount) + 1);
    var minTime = Math.max(60, Math.floor(totalTimeInSeconds / (themeCount * 2)));

    for (var i = 0; i < themeCount && remainingTime > 0; i++) {
        var time = Math.floor(Math.random() * (maxTime - minTime + 1)) + minTime;
        time = Math.min(time, remainingTime);
        distributedTimes.push(time);
        remainingTime -= time;
    }

    return distributedTimes;
}

function formatSecondsToTime(distributedTimes) {
    var formattedTimes = [];
    distributedTimes.forEach(function(time) {
        var hours = Math.floor(time / 3600);
        var minutes = Math.floor((time % 3600) / 60);
        var seconds = time % 60;
        formattedTimes.push(padZero(hours) + ":" + padZero(minutes) + ":" + padZero(seconds));
    });
    return formattedTimes;
}

function padZero(num) {
    return (num < 10 ? '0' : '') + num;
}

function exportToCSV(data) {
    var csvContent = "data:text/csv;charset=utf-8," + data.join("\n");
    var encodedUri = encodeURI(csvContent);
    var link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "distributed_times.csv");
    document.body.appendChild(link);
    link.click();
}
