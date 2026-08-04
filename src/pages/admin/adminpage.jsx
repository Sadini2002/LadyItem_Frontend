import AdminSidebar from "../components/AdminSidebar";
import {
  Users,
  Package,
  ShoppingCart,
  DollarSign
} from "lucide-react";


export default function Admin() {


  const cards = [
    {
      title:"Total Users",
      value:"1,250",
      icon:<Users size={30}/>
    },

    {
      title:"Products",
      value:"320",
      icon:<Package size={30}/>
    },

    {
      title:"Orders",
      value:"850",
      icon:<ShoppingCart size={30}/>
    },

    {
      title:"Revenue",
      value:"Rs.250,000",
      icon:<DollarSign size={30}/>
    }
  ];


  return (

    <div className="
    min-h-screen
    bg-gradient-to-br
    from-[#FFF5F4]
    via-white
    to-[#FFE5E0]
    flex
    ">


      {/* Sidebar */}

      <AdminSidebar/>




      {/* Main Content */}

      <main className="
      flex-1
      p-8
      ml-64
      ">


        <h1 className="
        text-4xl
        font-bold
        text-[#8B1A24]
        mb-8
        ">
          Admin Dashboard
        </h1>




        {/* Cards */}

        <div className="
        grid
        grid-cols-1
        md:grid-cols-2
        xl:grid-cols-4
        gap-6
        ">


        {
          cards.map((card,index)=>(

            <div
            key={index}
            className="
            bg-white/60
            backdrop-blur-xl
            border
            border-white/40
            rounded-3xl
            p-6
            shadow-xl
            hover:-translate-y-2
            transition
            "
            >


              <div className="
              text-[#8B1A24]
              mb-4
              ">
                {card.icon}
              </div>


              <h3 className="
              text-gray-600
              ">
                {card.title}
              </h3>


              <p className="
              text-3xl
              font-bold
              text-[#121212]
              mt-2
              ">
                {card.value}
              </p>


            </div>

          ))
        }


        </div>




        {/* Recent Orders */}

        <div className="
        mt-10
        bg-white/60
        backdrop-blur-xl
        rounded-3xl
        shadow-xl
        p-6
        ">


          <h2 className="
          text-2xl
          font-bold
          text-[#8B1A24]
          mb-5
          ">
            Recent Orders
          </h2>



          <table className="
          w-full
          ">


            <thead>

              <tr className="
              border-b
              ">

                <th className="text-left p-3">
                  Customer
                </th>


                <th className="text-left p-3">
                  Product
                </th>


                <th className="text-left p-3">
                  Status
                </th>


                <th className="text-left p-3">
                  Amount
                </th>


              </tr>

            </thead>



            <tbody>


              <tr className="border-b">

                <td className="p-3">
                  Sarah
                </td>

                <td className="p-3">
                  Red Dress
                </td>

                <td className="p-3 text-green-600">
                  Completed
                </td>

                <td className="p-3">
                  Rs.4500
                </td>

              </tr>



              <tr>

                <td className="p-3">
                  Emma
                </td>

                <td className="p-3">
                  Hand Bag
                </td>

                <td className="p-3 text-yellow-600">
                  Pending
                </td>

                <td className="p-3">
                  Rs.8000
                </td>

              </tr>


            </tbody>


          </table>


        </div>



      </main>


    </div>

  );
}