import { useState } from "react";
import { AlertTriangle, Play } from "lucide-react";
import Header from "../../components/Header/Header";
import Sidebar from "../../components/Sidebar/Sidebar";

import { API_BASE_URL } from '../../services/api';

const defaultQuery = {
  size: 5,
  "_source": [
    "@timestamp",
    "agent.name",
    "agent.ip",
    "rule.id",
    "rule.level",
    "rule.description",
    "decoder.name",
    "full_log"
  ],
  query: {
    bool: {
      filter: [
        {
          term: {
            "rule.id": "550"
          }
        }
      ]
    }
  },
  sort: [
    {
      "@timestamp": {
        order: "desc"
      }
    }
  ]
};


const PlaygroundPage = () => {

  const [query, setQuery] = useState(
    JSON.stringify(defaultQuery, null, 2)
  );

  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");


  const executeQuery = async () => {

    setLoading(true);
    setError("");
    setResult(null);

    try {

      const parsedQuery = JSON.parse(query);

      const response = await fetch(`${API_BASE_URL}/indexer-proxy`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(parsedQuery)
      });


      if (!response.ok) {
        throw new Error(
          `Backend error ${response.status}`
        );
      }


      const data = await response.json();

      setResult(data);


    } catch(err:any){

      setError(
        err.message || "Failed executing query"
      );

    }
    finally{
      setLoading(false);
    }

  };


  const flattenObject = (
    obj:any,
    prefix=""
  ):any => {

    let result:any = {};

    Object.keys(obj || {}).forEach(key=>{

      const value=obj[key];

      if(
        typeof value==="object" &&
        value!==null &&
        !Array.isArray(value)
      ){

        Object.assign(
          result,
          flattenObject(
            value,
            `${prefix}${key}.`
          )
        );

      }
      else{

        result[
          `${prefix}${key}`
        ] = Array.isArray(value)
          ? value.join(", ")
          : value;

      }

    });

    return result;

  };


  const getRows = () => {

    return (
      result?.hits?.hits?.map(
        (item:any)=>
          flattenObject(item._source)
      ) || []
    );

  };


  const rows = getRows();


  const columns =
    rows.length > 0
      ? Object.keys(rows[0])
      : [];


  return (

    <div className="app-shell">

      <Sidebar />

      <div className="main-panel">

        <Header />


        <main className="main-panel-content">

          <div className="container-fluid">


            <h2>
              Wazuh Query Playground
            </h2>

            <p className="text-muted">
              Write an OpenSearch JSON query and execute it against Wazuh Indexer.
            </p>



            <div className="card p-4">


              <textarea
                value={query}
                onChange={
                  e=>setQuery(e.target.value)
                }
                rows={18}
                className="form-control font-monospace"
              />



              <button
                className="btn btn-success mt-3 d-flex align-items-center gap-2"
                onClick={executeQuery}
                disabled={loading}
              >

                <Play size={18}/>

                {
                  loading
                    ? "Executing..."
                    : "Execute Query"
                }

              </button>



              {
                error &&
                <div className="alert alert-danger mt-3">

                  <AlertTriangle size={18}/>
                  {" "}
                  {error}

                </div>
              }



            </div>




            {
              result &&
              <div className="card mt-4 p-3">


                <h5>
                  Wazuh Results
                </h5>


                <p>
                  Total Hits:
                  {" "}
                  {
                    result?.hits?.total?.value || 0
                  }
                </p>



                {
                  rows.length > 0
                  ?

                  <div className="table-responsive">


                    <table className="table table-bordered table-striped">


                      <thead>

                        <tr>

                          {
                            columns.map(col=>

                              <th key={col}>
                                {col}
                              </th>

                            )
                          }

                        </tr>

                      </thead>



                      <tbody>

                        {
                          rows.map(
                            (row:any,index:number)=>

                            <tr key={index}>

                              {
                                columns.map(col=>

                                  <td key={col}>
                                    {
                                      row[col] ?? "-"
                                    }
                                  </td>

                                )
                              }

                            </tr>

                          )
                        }

                      </tbody>


                    </table>


                  </div>


                  :

                  <p>
                    No records found
                  </p>


                }



              </div>
            }



          </div>


        </main>


      </div>

    </div>

  );

};


export default PlaygroundPage;
