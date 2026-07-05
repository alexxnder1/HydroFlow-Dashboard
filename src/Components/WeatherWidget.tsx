import { useEffect, useMemo } from "react";

const WeatherWidget = () => {


    const tryToGetWidget = (id) => {
      const script = document.createElement("script");
      script.id = id;
      script.src = "https://weatherwidget.io/js/widget.min.js";
      document.body.appendChild(script);
    };

    useEffect(() => {
      const id = "weatherwidget-io-js";
      if (!document.getElementById(id)) tryToGetWidget(id);
       else  tryToGetWidget(id);

    }, []);

    return (
        <a
        className="weatherwidget-io"
        href="https://forecast7.com/ro/45d2426d75/sapoca/"
        data-label_1="SĂPOCA"
        data-label_2="Prognoza"
        data-icons="Climacons Animated"
        data-textcolor="#ffffff"
        >
        SĂPOCA Prognoza
    </a>
    );
}

export default WeatherWidget;