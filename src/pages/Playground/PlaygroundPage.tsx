
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

    } catch (err: any) {

      setError(
        err.message || "Failed executing query"
      );

    }
    finally {
      setLoading(false);
    }
  };

  const flattenObject = (
    obj: any,
    prefix = ""
  ): any => {

    let result: any = {};

    Object.keys(obj || {}).forEach(key => {

      const value = obj[key];

      if (
        typeof value === "object" &&
        value !== null &&
        !Array.isArray(value)
      ) {

        Object.assign(
          result,
          flattenObject(
            value,
            `${prefix}${key}.`
          )
        );

      }
      else {

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
        (item: any) =>
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

    <div className="app-shell playground-theme">

      <style>{`

        /* =========================================
           SIEM PLAYGROUND THEME
        ========================================= */

        .playground-theme {

          min-height:100vh;

          background:
          radial-gradient(
            circle at top,
            #164e9c,
            #020617 65%
          );

          color:white;

          position:relative;

          font-family:"Segoe UI", sans-serif;

          overflow-x:hidden;

        }


        /* Cyber grid */

        .playground-theme::before {

          content:"";

          position:fixed;

          inset:0;

          background-image:

          linear-gradient(
            rgba(59,130,246,0.08) 1px,
            transparent 1px
          ),

          linear-gradient(
            90deg,
            rgba(59,130,246,0.08) 1px,
            transparent 1px
          );

          background-size:45px 45px;

          pointer-events:none;

          z-index:0;

        }


        .playground-theme .main-panel {

          position:relative;

          z-index:1;

          background:transparent;

        }


        .playground-theme .main-panel-content {

          background:transparent;

          min-height:calc(100vh - 70px);

          padding-top:30px;

        }


        .playground-theme .container-fluid {

          position:relative;

          z-index:2;

        }


        /* =========================================
           PAGE TITLE
        ========================================= */

        .playground-theme h2 {

          font-size:32px;

          font-weight:800;

          letter-spacing:1px;

          margin-bottom:6px;

          color:#ffffff;

          text-shadow:
          0 0 15px rgba(37,99,235,0.55);

        }


        .playground-theme .text-muted {

          color:#93c5fd !important;

          font-size:15px;

        }


        /* =========================================
           QUERY CARD
        ========================================= */

        .playground-theme .card {

          background:
          rgba(2,6,23,0.72) !important;

          border:

          1px solid
          rgba(59,130,246,0.35) !important;

          border-radius:16px;

          box-shadow:

          0 10px 35px
          rgba(0,0,0,0.35),

          0 0 25px
          rgba(37,99,235,0.08);

          backdrop-filter:blur(12px);

          color:white;

        }


        /* =========================================
           QUERY TEXTAREA
        ========================================= */

        .playground-theme textarea.form-control {

          background:
          rgba(2,6,23,0.9) !important;

          border:
          1px solid
          rgba(59,130,246,0.45) !important;

          border-radius:12px;

          color:#bfdbfe !important;

          font-family:

          "Cascadia Code",
          "Fira Code",
          Consolas,
          monospace;

          font-size:14px;

          line-height:1.6;

          padding:18px;

          resize:vertical;

          box-shadow:
          inset 0 0 20px
          rgba(15,23,42,0.7);

          transition:0.3s;

        }


        .playground-theme textarea.form-control:focus {

          border-color:#0ea5e9 !important;

          box-shadow:

          0 0 0 2px
          rgba(14,165,233,0.15),

          0 0 25px
          rgba(14,165,233,0.25);

          outline:none;

        }


        /* =========================================
           EXECUTE BUTTON
        ========================================= */

        .playground-theme .btn-success {

          background:

          linear-gradient(
            135deg,
            #2563eb,
            #0ea5e9
          ) !important;

          border:none !important;

          border-radius:12px;

          padding:11px 24px;

          color:white;

          font-size:15px;

          font-weight:700;

          box-shadow:

          0 0 20px
          rgba(14,165,233,0.35);

          transition:0.3s;

        }


        .playground-theme .btn-success:hover {

          transform:
          translateY(-2px)
          scale(1.02);

          box-shadow:

          0 0 35px
          rgba(14,165,233,0.75);

        }


        .playground-theme .btn-success:disabled {

          opacity:0.65;

          transform:none;

          box-shadow:none;

          cursor:not-allowed;

        }


        /* =========================================
           ERROR ALERT
        ========================================= */

        .playground-theme .alert-danger {

          background:
          rgba(127,29,29,0.25) !important;

          border:
          1px solid
          rgba(248,113,113,0.45) !important;

          border-radius:12px;

          color:#fecaca !important;

          display:flex;

          align-items:center;

          gap:6px;

          box-shadow:
          0 0 20px
          rgba(239,68,68,0.12);

        }


        /* =========================================
           RESULTS CARD
        ========================================= */

        .playground-theme .card.mt-4 {

          overflow:hidden;

        }


        .playground-theme .card h5 {

          color:#ffffff;

          font-size:20px;

          font-weight:700;

          letter-spacing:0.5px;

          margin-bottom:12px;

        }


        .playground-theme .card p {

          color:#cbd5e1;

        }


        /* =========================================
           RESULTS TABLE
        ========================================= */

        .playground-theme .table-responsive {

          border-radius:12px;

          border:
          1px solid
          rgba(59,130,246,0.25);

          overflow:auto;

        }


        .playground-theme table {

          margin-bottom:0;

          color:#e2e8f0;

          background:
          rgba(2,6,23,0.8);

          min-width:max-content;

        }


        .playground-theme table thead {

          background:

          linear-gradient(
            135deg,
            rgba(37,99,235,0.45),
            rgba(14,165,233,0.25)
          );

        }


        .playground-theme table thead th {

          color:#bfdbfe;

          border-color:
          rgba(59,130,246,0.3);

          font-size:13px;

          font-weight:700;

          white-space:nowrap;

          padding:12px 14px;

          text-transform:none;

        }


        .playground-theme table tbody td {

          background:
          rgba(2,6,23,0.65);

          color:#cbd5e1;

          border-color:
          rgba(59,130,246,0.18);

          font-size:13px;

          padding:11px 14px;

          vertical-align:middle;

          white-space:nowrap;

        }


        .playground-theme table tbody tr {

          transition:0.2s;

        }


        .playground-theme table tbody tr:hover td {

          background:
          rgba(37,99,235,0.12);

          color:#ffffff;

        }


        /* =========================================
           SCROLLBAR
        ========================================= */

        .playground-theme ::-webkit-scrollbar {

          width:8px;

          height:8px;

        }


        .playground-theme ::-webkit-scrollbar-track {

          background:#020617;

        }


        .playground-theme ::-webkit-scrollbar-thumb {

          background:
          rgba(37,99,235,0.65);

          border-radius:10px;

        }


        .playground-theme ::-webkit-scrollbar-thumb:hover {

          background:#0ea5e9;

        }


        /* =========================================
           RESPONSIVE
        ========================================= */

        @media(max-width:768px){

          .playground-theme .main-panel-content {

            padding-top:20px;

          }


          .playground-theme h2 {

            font-size:25px;

          }


          .playground-theme .text-muted {

            font-size:13px;

          }


          .playground-theme .card {

            border-radius:12px;

            padding:16px !important;

          }


          .playground-theme textarea.form-control {

            font-size:12px;

            padding:14px;

          }


          .playground-theme .btn-success {

            width:100%;

            justify-content:center;

          }

        }

        /* =========================================
   QUERY TEXTAREA
========================================= */

.playground-theme textarea.form-control {

  display: block;

  width: 100%;

  height: 420px;

  min-height: 420px;

  max-height: 420px;

  resize: none;

  box-sizing: border-box;

  background:
  rgba(2,6,23,0.95) !important;

  border:
  1px solid
  rgba(59,130,246,0.55) !important;

  border-radius: 12px;

  color:#bfdbfe !important;

  font-family:
  "Cascadia Code",
  "Fira Code",
  Consolas,
  monospace;

  font-size:14px;

  line-height:1.6;

  padding:18px;

  overflow:auto;

  box-shadow:
  inset 0 0 20px
  rgba(15,23,42,0.7);

  transition:0.3s;

}


.playground-theme textarea.form-control:focus {

  border-color:#0ea5e9 !important;

  box-shadow:

  0 0 0 2px
  rgba(14,165,233,0.15),

  0 0 25px
  rgba(14,165,233,0.25);

  outline:none;

}


/* =========================================
   EXECUTE BUTTON
   BELOW QUERY BOX
========================================= */

.playground-theme .btn-success {

  display: flex;

  align-items: center;

  justify-content: center;

  gap: 8px;

  width: fit-content;

  margin-top: 16px !important;

  margin-left: 0;

  position: static;

  background:

  linear-gradient(
    135deg,
    #2563eb,
    #0ea5e9
  ) !important;

  border:none !important;

  border-radius:12px;

  padding:11px 24px;

  color:white;

  font-size:15px;

  font-weight:700;

  box-shadow:

  0 0 20px
  rgba(14,165,233,0.35);

  transition:0.3s;

}


.playground-theme .btn-success:hover {

  transform:
  translateY(-2px)
  scale(1.02);

  box-shadow:

  0 0 35px
  rgba(14,165,233,0.75);

}


.playground-theme .btn-success:disabled {

  opacity:0.65;

  transform:none;

  box-shadow:none;

  cursor:not-allowed;

}

      `}</style>


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
                  e => setQuery(e.target.value)
                }
                rows={18}
                className="form-control font-monospace"
              />


              <button
                className="btn btn-success mt-3 d-flex align-items-center gap-2"
                onClick={executeQuery}
                disabled={loading}
              >

                <Play size={18} />

                {
                  loading
                    ? "Executing..."
                    : "Execute Query"
                }

              </button>


              {
                error &&
                <div className="alert alert-danger mt-3">

                  <AlertTriangle size={18} />

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
                              columns.map(col =>

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
                              (row: any, index: number) =>

                                <tr key={index}>

                                  {
                                    columns.map(col =>

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

