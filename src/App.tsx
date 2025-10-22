import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Layout } from "./components/Layout";
import Dashboard from "./pages/Dashboard";
import Customers from "./pages/Customers";
import Projects from "./pages/Projects";
import Materials from "./pages/Materials";
import Quotes from "./pages/Quotes";
import Orders from "./pages/Orders";
import Schedule from "./pages/Schedule";
import Finance from "./pages/Finance";
import Calculator from "./pages/Calculator";
import Team from "./pages/Team";
import Profile from "./pages/Profile";
import Messages from "./pages/Messages";
import NotFound from "./pages/NotFound";
import CustomerDetail from "./pages/CustomerDetail";
import CustomerForm from "./pages/CustomerForm";
import ProjectDetail from "./pages/ProjectDetail";
import ProjectForm from "./pages/ProjectForm";
import MaterialDetail from "./pages/MaterialDetail";
import MaterialForm from "./pages/MaterialForm";
import TransactionForm from "./pages/TransactionForm";
import QuoteDetail from "./pages/QuoteDetail";
import QuoteForm from "./pages/QuoteForm";
import OrderDetail from "./pages/OrderDetail";
import OrderForm from "./pages/OrderForm";
import ScheduleDetail from "./pages/ScheduleDetail";
import ScheduleForm from "./pages/ScheduleForm";
import TeamDetail from "./pages/TeamDetail";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Layout>
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/customers" element={<Customers />} />
            <Route path="/customers/new" element={<CustomerForm />} />
            <Route path="/customers/:id" element={<CustomerDetail />} />
            <Route path="/customers/:id/edit" element={<CustomerForm />} />
            <Route path="/projects" element={<Projects />} />
            <Route path="/projects/new" element={<ProjectForm />} />
            <Route path="/projects/:id" element={<ProjectDetail />} />
            <Route path="/projects/:id/edit" element={<ProjectForm />} />
            <Route path="/materials" element={<Materials />} />
            <Route path="/materials/new" element={<MaterialForm />} />
            <Route path="/materials/:id" element={<MaterialDetail />} />
            <Route path="/materials/:id/edit" element={<MaterialForm />} />
            <Route path="/materials/:id/add-stock" element={<MaterialForm />} />
            <Route path="/quotes" element={<Quotes />} />
            <Route path="/quotes/new" element={<QuoteForm />} />
            <Route path="/quotes/:id" element={<QuoteDetail />} />
            <Route path="/quotes/:id/edit" element={<QuoteForm />} />
            <Route path="/orders" element={<Orders />} />
            <Route path="/orders/new" element={<OrderForm />} />
            <Route path="/orders/:id" element={<OrderDetail />} />
            <Route path="/orders/:id/edit" element={<OrderForm />} />
            <Route path="/schedule" element={<Schedule />} />
            <Route path="/schedule/new" element={<ScheduleForm />} />
            <Route path="/schedule/:id" element={<ScheduleDetail />} />
            <Route path="/schedule/:id/edit" element={<ScheduleForm />} />
            <Route path="/finance" element={<Finance />} />
            <Route path="/finance/transaction/new" element={<TransactionForm />} />
            <Route path="/calculator" element={<Calculator />} />
            <Route path="/team" element={<Team />} />
            <Route path="/team/:id" element={<TeamDetail />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/messages" element={<Messages />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Layout>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
