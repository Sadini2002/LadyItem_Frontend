import {
  LayoutDashboard,
  Users,
  Package,
  ShoppingCart,
  LogOut
} from "lucide-react";


export default function AdminSidebar(){

return(

<aside className="
fixed
left-0
top-0
h-screen
w-64
bg-[#121212]
text-white
p-6
">


<h1 className="
text-3xl
font-bold
text-[#FF8A75]
mb-10
">
LadyItem
</h1>



<nav className="space-y-5">


<div className="flex gap-3 items-center hover:text-[#FF8A75]">
<LayoutDashboard/>
Dashboard
</div>


<div className="flex gap-3 items-center hover:text-[#FF8A75]">
<Package/>
Products
</div>


<div className="flex gap-3 items-center hover:text-[#FF8A75]">
<Users/>
Users
</div>



<div className="flex gap-3 items-center hover:text-[#FF8A75]">
<ShoppingCart/>
Orders
</div>


<div className="flex gap-3 items-center hover:text-[#FF8A75]">
<LogOut/>
Logout
</div>


</nav>


</aside>


)

}