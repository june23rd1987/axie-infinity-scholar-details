import { useEffect, useRef, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { getSlpAction } from '../redux/slp';
import { getMmrAction } from '../redux/mmr';
import { getAxiesAction } from '../redux/axies';

const useDatahooks = () => {
  const slp = useSelector((state) => state.slp);
  const mmr = useSelector((state) => state.mmr);
  const axies = useSelector((state) => state.axies);
  const roninRef = useRef();
  const managerPerRef = useRef();
  const scholarPerRef = useRef();
  const dispatch = useDispatch();
  const LOCAL_STORAGE_SCHOLAR_DETAILS = 'scholarDetails';
  const storedDetails = JSON.parse(localStorage.getItem(LOCAL_STORAGE_SCHOLAR_DETAILS));
  const [errorMessageMMR, setErrorMessageMMR] = useState('');
  const [errorMessageSLP, setErrorMessageSLP] = useState('');
  const [errorMessageAxies, setErrorMessageAxies] = useState('');
  const [percentage, setPercentage] = useState(100);

  const handleRonin = (e, roninRef, managerPerRef, scholarPerRef) => {
    const ronin = roninRef.current.value;
    const scholarDetails = [];
    scholarDetails.push(
      {
        ronin,
        managerPer: managerPerRef.current.value,
        scholarPer: scholarPerRef.current.value,
      },
    );
    e.preventDefault();
    dispatch(getSlpAction(ronin)).catch((error) => setErrorMessageSLP(`SLP: ${error.message}`));
    dispatch(getMmrAction(ronin)).catch((error) => setErrorMessageMMR(`MMR: ${error.message}`));
    dispatch(getAxiesAction(ronin)).catch((error) => setErrorMessageAxies(`Axies data: ${error.message}`));
    localStorage.setItem(LOCAL_STORAGE_SCHOLAR_DETAILS, JSON.stringify(scholarDetails));
  };

  const handlePercentage = () => {
    const managerCurrentPer = 100 - (scholarPerRef.current.value);
    const button = document.getElementById('submitDetails');
    if (managerCurrentPer > 100 || managerCurrentPer < 0 || Number.isNaN(managerCurrentPer)) {
      setPercentage('Invalid format.');
      button.setAttribute('disabled', true);
    } else {
      setPercentage(managerCurrentPer);
      button.removeAttribute('disabled');
    }
  };

  useEffect(() => {
    if (storedDetails && storedDetails[0].ronin !== null) {
      dispatch(getSlpAction(storedDetails[0].ronin));
      dispatch(getMmrAction(storedDetails[0].ronin));
      dispatch(getAxiesAction(storedDetails[0].ronin));
    }
  }, []);

  return {
    slp,
    mmr,
    axies,
    roninRef,
    managerPerRef,
    scholarPerRef,
    errorMessageMMR,
    errorMessageSLP,
    errorMessageAxies,
    handleRonin,
    handlePercentage,
    percentage,
    storedDetails,
  };
};

export default useDatahooks;
