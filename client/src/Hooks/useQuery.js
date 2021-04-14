import { useState, useEffect } from "react";
import { useHistory } from "react-router";

const useQuery = (url, method, data) => {
  const history = useHistory();
  const [apiData, setApiData] = useState();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const options = {
      method,
      credentials: "include",
      body: data,
    };

    if (method === "GET") {
      delete options.body;
    }

    if (!data instanceof FormData) {
      options.body = JSON.stringify(data);
    }

    fetch(url, options)
      .then((data) => {
        console.log("history", history);
        if (data.status > 400) {
          history.replace(history.location.pathname, {
            errorStatusCode: data.status,
          });
        }
        return data.json();
      })
      .then((data) => {
        setApiData(data);
        setLoading(false);
      });
  }, [data, url, method]);
  console.log("userquery", apiData);
  return { data: apiData, loading };
};

export default useQuery;
