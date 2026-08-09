import { Shield, ArrowLeft, Bot, Activity } from "lucide-react";
import { useNavigate } from "react-router-dom";

const MainPage = () => {

  const navigate = useNavigate();


  return (
    <>

      <style>{`

        .main-page {

          min-height:100vh;

          background:
          radial-gradient(
            circle at top,
            #164e9c,
            #020617 70%
          );

          display:flex;

          justify-content:center;

          align-items:center;

          color:white;

          font-family:"Segoe UI", sans-serif;

        }



        .main-card {

          width:600px;

          padding:40px;

          text-align:center;

          border-radius:20px;

          background:
          rgba(255,255,255,0.08);


          backdrop-filter:blur(12px);


          box-shadow:

          0 0 40px
          rgba(14,165,233,0.4);

        }




        .logo {


          width:90px;

          height:90px;

          margin:auto;


          display:flex;

          justify-content:center;

          align-items:center;


          border-radius:50%;


          background:

          linear-gradient(
            135deg,
            #2563eb,
            #06b6d4
          );


          box-shadow:

          0 0 30px
          rgba(37,99,235,0.8);


        }





        h1 {

          margin-top:25px;

          font-size:40px;

          letter-spacing:2px;

        }




        .subtitle {

          color:#93c5fd;

          font-size:20px;

          margin-top:10px;

        }




        .features {

          margin-top:30px;

          display:flex;

          justify-content:center;

          gap:20px;

        }




        .feature-box {


          padding:20px;

          width:150px;

          border-radius:15px;


          background:

          rgba(255,255,255,0.1);


        }





        .feature-box p {

          font-size:14px;

          color:#cbd5e1;

        }






        .status {


          margin-top:30px;


          display:inline-block;


          padding:10px 25px;


          border-radius:20px;


          background:#065f46;


          color:#6ee7b7;


        }





        .back-button {


          margin-top:35px;


          padding:14px 30px;


          border:none;


          border-radius:12px;


          display:flex;


          align-items:center;


          gap:10px;


          margin-left:auto;


          margin-right:auto;


          cursor:pointer;


          color:white;


          font-size:16px;


          font-weight:600;



          background:

          linear-gradient(
            135deg,
            #2563eb,
            #0ea5e9
          );


          transition:0.3s;


        }





        .back-button:hover {


          transform:translateY(-4px);


          box-shadow:

          0 0 25px
          rgba(14,165,233,0.8);


        }





        @media(max-width:700px){


          .main-card {

            width:85%;

          }


          .features {

            flex-direction:column;

            align-items:center;

          }


        }


      `}</style>




      <div className="main-page">


        <div className="main-card">


          <div className="logo">

            <Shield size={45}/>

          </div>




          <h1>

            SIEM ASSISTANT HUB

          </h1>



          <div className="subtitle">

            Wazuh AI Security Operations Platform

          </div>




          <div className="features">
           
           <div className='feature-card'
           onClick={() => navigate("/chatbot")}>

            <div className="feature-box">

              <Bot size={30}/>

              <p>

                AI Chat Assistant

              </p>

            </div>
            </div>
            



            <div className="feature-box">

              <Activity size={30}/>

              <p>

                Threat Monitoring

              </p>

            </div>


          </div>




          <div className="status">

            🟢 System Online

          </div>




          <button

            className="back-button"

            onClick={() => navigate("/")}

          >

            <ArrowLeft size={18}/>

            Back to Home

          </button>



        </div>


      </div>


    </>

  );

};


export default MainPage;