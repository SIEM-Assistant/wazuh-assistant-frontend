import React from "react";
import { Shield, ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";

const FrontPage = () => {

  const navigate = useNavigate();

  return (
    <>

      <style>{`

        .front-page {

          min-height:100vh;

          background:
          radial-gradient(
            circle at top,
            #164e9c,
            #020617 65%
          );

          display:flex;

          justify-content:center;

          align-items:center;

          color:white;

          overflow:hidden;

          position:relative;

          font-family:"Segoe UI", sans-serif;

        }



        .cyber-grid {

          position:absolute;

          inset:0;


          background-image:

          linear-gradient(
            rgba(59,130,246,0.12) 1px,
            transparent 1px
          ),

          linear-gradient(
            90deg,
            rgba(59,130,246,0.12) 1px,
            transparent 1px
          );


          background-size:45px 45px;

        }





        .hero-section {

          position:relative;

          z-index:2;

          text-align:center;

          max-width:800px;

          padding:20px;

        }





        .logo-circle {


          width:80px;

          height:80px;


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

          0 0 25px
          rgba(37,99,235,0.8);


        }





        .logo-circle svg {

          width:40px;

          height:40px;

        }





        h1 {

          margin-top:15px;

          font-size:45px;

          letter-spacing:3px;

          font-weight:900;

        }





        .subtitle {

          margin-top:8px;

          font-size:20px;

          color:#93c5fd;

        }





        .description {

          margin:12px auto;

          max-width:600px;

          font-size:15px;

          line-height:1.5;

          color:#cbd5e1;

        }







        .enter-button {


          margin-top:20px;


          display:inline-flex;


          align-items:center;


          justify-content:center;


          gap:8px;



          padding:12px 40px;



          border:none;



          border-radius:12px;



          color:white;



          font-size:16px;



          font-weight:700;



          cursor:pointer;




          background:


          linear-gradient(
            135deg,
            #2563eb,
            #0ea5e9
          );





          box-shadow:


          0 0 20px
          rgba(14,165,233,0.5);




          transition:0.3s;



        }







        .enter-button:hover {


          transform:

          translateY(-3px)
          scale(1.03);




          box-shadow:


          0 0 35px
          rgba(14,165,233,0.9);



        }







        @media(max-width:768px){


          h1 {

            font-size:32px;

          }



          .subtitle {

            font-size:18px;

          }



          .description {

            font-size:14px;

          }


        }



      `}</style>





      <div className="front-page">



        <div className="cyber-grid"></div>





        <div className="hero-section">





          <div className="logo-circle">

            <Shield />

          </div>






          <h1>

            SIEM ASSISTANT - WAZUH

          </h1>







          <div className="subtitle">

            AI Powered Automated Query Generation

          </div>







          <p className="description">

            Monitor threats, analyze security alerts,
            investigate incidents and improve SOC
            operations with intelligent Wazuh assistance.

          </p>








          <button

            className="enter-button"

            onClick={() => navigate("/main")}

          >

            Enter Hub

          </button>







        </div>





      </div>


    </>
  );

};


export default FrontPage;