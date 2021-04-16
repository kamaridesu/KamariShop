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
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    };

    if (method === "GET") {
      delete options.body;
    }

    if (data instanceof FormData) {
      options.body = data;
      delete options.headers;
    }

    fetch(url, options)
      .then((data) => {
        if (data.status > 400) {
          history.replace(history.location.pathname, {
            errorStatusCode: data.status,
          });
        }
        return data.json();
      })
      .then((data) => {
        setApiData(() => (Object.keys(data).length === 0 ? null : data));
        setLoading(false);
      });
    //history added careful
  }, [data, url, method, history]);

  return { data: apiData, loading };
};

export default useQuery;
