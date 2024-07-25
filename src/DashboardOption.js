export default option = {
    series: [
        {
            type: "gauge",
            startAngle: 150,
            endAngle: 30,
            center: ["50%", "75%"],
            radius: "135%",
            min: -10,
            max: 10,
            splitNumber: 5,
            axisLine: {
                lineStyle: {
                    width: 0,
                    color: [
                        [0.37, "#000"],
                        [0.6, "lightgreen"],
                        [1, "#000"],
                    ],
                },
            },
            pointer: {
                icon: "path://M2090.36389,615.30999 L2090.36389,615.30999 C2091.48372,615.30999 2092.40383,616.194028 2092.44859,617.312956 L2096.90698,728.755929 C2097.05155,732.369577 2094.2393,735.416212 2090.62566,735.56078 C2090.53845,735.564269 2090.45117,735.566014 2090.36389,735.566014 L2090.36389,735.566014 C2086.74736,735.566014 2083.81557,732.63423 2083.81557,729.017692 C2083.81557,728.930412 2083.81732,728.84314 2083.82081,728.755929 L2088.2792,617.312956 C2088.32396,616.194028 2089.24407,615.30999 2090.36389,615.30999 Z",
                length: "100%",
                width: 10,
                itemStyle: {
                    // color: "lightgreen",
                    color: "rgba(0, 0, 0, 0.3)",
                    // shadowColor: "rgba(0, 0, 0, 0.3)",
                    shadowBlur: 8,
                    shadowOffsetX: 2,
                    shadowOffsetY: 4,
                },
            },
            axisTick: {
                length: 12,
                lineStyle: {
                    color: "auto",
                    width: 2,
                },
            },
            splitLine: {
                length: 20,
                lineStyle: {
                    color: "auto",
                    width: 5,
                },
            },
            axisLabel: {
                formatter: function () {
                    return "";
                },
            },
            title: {
                offsetCenter: [0, "-10%"],
                fontSize: 20,
            },
            detail: {
                fontSize: 40,
                fontWeight: 300,
                offsetCenter: [0, "-55%"],
                valueAnimation: true,
                // formatter: function (value) {
                //   return 'C';
                //   return xian[selectedXianId-1].char;
                // },
                // formatter: 'C',
                formatter: () => "",
                color: "#000",
            },
            data: [
                {
                    value: freq - stdFreq,
                },
            ],
        },
    ],
};