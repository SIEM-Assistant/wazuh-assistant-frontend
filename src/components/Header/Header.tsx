// import { Search, Sparkles } from 'lucide-react'

// const Header = () => {
//   return (
//     <header className="topbar">
//       <div className="topbar-left">
//         <Sparkles size={18} color="#10A37F" />
//         <span className="fw-semibold" style={{ color: '#111827' }}>SIEM Playground</span>
//       </div>
//       <div className="topbar-right">
//         <Search size={16} />
//         <span className="topbar-description">Natural language to Wazuh</span>
//       </div>
//     </header>
//   )
// }

// export default Header
import { Search, Sparkles } from 'lucide-react'

const Header = () => {
  return (
    <>
      <style>{`

        /* =========================================
           SIEM HEADER / TOPBAR
        ========================================= */

        .topbar {

          height: 64px;

          display: flex;

          align-items: center;

          justify-content: space-between;

          padding: 0 28px;

          background:
          linear-gradient(
            135deg,
            #0f2f63,
            #020617
          );

          color: #ffffff;

          border-bottom:
          1px solid
          rgba(59,130,246,0.35);

          box-shadow:

          0 4px 20px
          rgba(0,0,0,0.25);

          position: relative;

          overflow: hidden;

          z-index: 20;

        }


        /* =========================================
           CYBER GRID
        ========================================= */

        .topbar::before {

          content: "";

          position: absolute;

          inset: 0;

          background-image:

          linear-gradient(
            rgba(59,130,246,0.07) 1px,
            transparent 1px
          ),

          linear-gradient(
            90deg,
            rgba(59,130,246,0.07) 1px,
            transparent 1px
          );

          background-size: 35px 35px;

          pointer-events: none;

        }


        /* =========================================
           LEFT SIDE
        ========================================= */

        .topbar-left {

          display: flex;

          align-items: center;

          gap: 10px;

          position: relative;

          z-index: 2;

        }


        .topbar-left svg {

          color: #06b6d4 !important;

          filter:

          drop-shadow(
            0 0 7px
            rgba(6,182,212,0.8)
          );

        }


        .topbar-left .fw-semibold {

          color: #ffffff !important;

          font-size: 16px;

          font-weight: 600;

          letter-spacing: 0.4px;

          text-shadow:

          0 0 10px
          rgba(59,130,246,0.55);

        }


        /* =========================================
           RIGHT SIDE
        ========================================= */

        .topbar-right {

          display: flex;

          align-items: center;

          gap: 9px;

          position: relative;

          z-index: 2;

          color: #93c5fd;

        }


        .topbar-right svg {

          color: #38bdf8;

          filter:

          drop-shadow(
            0 0 5px
            rgba(56,189,248,0.7)
          );

        }


        .topbar-description {

          color: #93c5fd;

          font-size: 14px;

          letter-spacing: 0.2px;

        }


        /* =========================================
           HOVER EFFECT
        ========================================= */

        .topbar-left:hover svg {

          color: #22d3ee !important;

          filter:

          drop-shadow(
            0 0 12px
            rgba(34,211,238,0.95)
          );

          transition: 0.25s;

        }


        /* =========================================
           RESPONSIVE
        ========================================= */

        @media(max-width:768px){

          .topbar {

            height: 58px;

            padding: 0 16px;

          }


          .topbar-description {

            display: none;

          }


          .topbar-right svg {

            display: none;

          }


          .topbar-left .fw-semibold {

            font-size: 14px;

          }

        }

      `}</style>


      <header className="topbar">

        <div className="topbar-left">

          <Sparkles
            size={18}
            color="#10A37F"
          />

          <span
            className="fw-semibold"
            style={{
              color: '#111827'
            }}
          >
            SIEM Playground
          </span>

        </div>


        {/* <div className="topbar-right">

          <Search size={16} />

          <span className="topbar-description">
            Natural language to Wazuh
          </span>

        </div> */}

      </header>

    </>
  )
}

export default Header