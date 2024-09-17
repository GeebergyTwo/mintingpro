import { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './styles/index.css';
import ErrorBoundary from './components/ErrorBoundary';
import { UserProvider } from './functionalComponents/UserRoleContext';
import Loading from './functionalComponents/Loading';
import PrivateRoute from './routes/PrivateRoute';
import PrivateDashboard from './routes/PrivateDashboard';
import PrivateFaqs from './routes/PrivateFaqs';
import PrivateMint from './routes/PrivateMint';
import PrivateWithdraw from './routes/PrivateWithdraw';
import PrivateUpgrade from './routes/PrivateUpgrade';
import PrivateAbout from './routes/PrivateAbout';
import PrivateTx from './routes/PrivateTx';
import PrivateSendAndReceive from './routes/PrivateSendAndReceive';
import Login from './components/Login';
import SignUp from './components/SignUp';
import Sidebar from './components/Navbar';
import Home from './components/Home';
import FAQS from './components/FAQS';
import MintPower from './components/MintPower';
import Withdraw from './components/Withdraw';
import UpgradeMint from './components/UpgradeMint';
import About from './components/About';
import TransactionList from './components/Transactions';
import Dashboard from './components/dashboard';
import SendAndReceive from './components/SendAndReceive';
import ToastProvider from './functionalComponents/ToastProvider';
import { Container } from 'react-bootstrap';

function App() {
  const [isLoading, setIsLoading] = useState(false);

  return (
      <UserProvider>
        <Router>
          <ErrorBoundary>
            {/* <ToastProvider> */}
              <Sidebar />
                  <Routes>
                    <Route path="/" element={<PrivateRoute element={<Home />} />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/signup" element={<SignUp />} />
                    <Route path="/faqs" element={<PrivateFaqs element={<FAQS />} />} />
                    <Route path="/mint" element={<PrivateMint element={<MintPower />} />} />
                    <Route path="/withdraw" element={<PrivateWithdraw element={<Withdraw />} />} />
                    <Route path="/upgrade" element={<PrivateUpgrade element={<UpgradeMint />} />} />
                    <Route path="/about" element={<PrivateAbout element={<About />} />} />
                    <Route path="/transactions" element={<PrivateTx element={<TransactionList />} />} />
                    <Route path="/profile" element={<PrivateDashboard element={<Dashboard />} />} />
                    <Route path="/transfer" element={<PrivateSendAndReceive element={<SendAndReceive />} />} />
                  </Routes>
            {/* </ToastProvider> */}
          </ErrorBoundary>
          {isLoading && <Loading />}
        </Router>
      </UserProvider>
  );
}

export default App;
