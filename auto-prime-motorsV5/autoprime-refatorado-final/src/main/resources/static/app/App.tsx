import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import DashboardLayout from "@/components/DashboardLayout";
import NotFound from "@/pages/NotFound";
import { Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import Home from "./pages/Home";
import Funcionarios from "./pages/Funcionarios";
import CadastroFuncionario from "./pages/CadastroFuncionario";
import Configuracoes from "./pages/Configuracoes";

function Router() {
  return (
    <Switch>
      <Route path="/">
        {() => (
          <DashboardLayout>
            <Home />
          </DashboardLayout>
        )}
      </Route>
      <Route path="/funcionarios">
        {() => (
          <DashboardLayout>
            <Funcionarios />
          </DashboardLayout>
        )}
      </Route>
      <Route path="/funcionarios/novo">
        {() => (
          <DashboardLayout>
            <CadastroFuncionario />
          </DashboardLayout>
        )}
      </Route>
      <Route path="/configuracoes">
        {() => (
          <DashboardLayout>
            <Configuracoes />
          </DashboardLayout>
        )}
      </Route>
      <Route path="/404" component={NotFound} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider defaultTheme="light">
        <TooltipProvider>
          <Toaster />
          <Router />
        </TooltipProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
