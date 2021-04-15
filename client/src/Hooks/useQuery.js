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
