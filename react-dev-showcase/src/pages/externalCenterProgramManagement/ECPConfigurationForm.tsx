/** 외부 센터프로그램 관리 > 등록 */
import { useState } from 'react';

import { FormProvider, useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';

import ProgressBar from '@src/components/organisms/ProgressBar';
import useProgram from '@src/hooks/rest/useProgram';
import PATHS from '@src/router/path';

import ECPFormStep1 from './module/ECPFormStep1';
import ECPFormStep2 from './module/ECPFormStep2';
import ECPFormStep3 from './module/ECPFormStep3';

const ECPConfigurationEdit = () => {
  // step 1 : 기본정보 /  step2 : 세션정보 / step3: 프로그램 정보
  const navigate = useNavigate();
  const { processedDetailData } = useProgram();

  // FIXME 실 데이터 연동 & 언어 mapping 수정, 유효성 검사 추가
  const method = useForm({
    defaultValues: {
      cpName: processedDetailData?.cpInfo?.cpName || '',
      programName:
        (processedDetailData?.programDetailList && processedDetailData?.programDetailList[0]?.programName) || '',
      languageType: '',
      programDescription:
        (processedDetailData?.programDetailList && processedDetailData?.programDetailList[0]?.programDescription) || '',
      priceYn: processedDetailData.priceYn || null,
      category: processedDetailData.category || '',
      ageGroup: processedDetailData.ageGroup || '',
      exerciseTime: processedDetailData.exerciseTime || '',
      exerciseLevel: processedDetailData.exerciseLevel || '',
      exerciseIntensity: processedDetailData.exerciseIntensity,
      countryType: (processedDetailData?.programDetailList && processedDetailData?.programDetailList[0]?.country) || '',
      sessions: [
        {
          sessionName: '',
          sessionInfo: '',
          daySelect: '',
          period: 0,
        },
      ],
    },
  });

  const [step, setStep] = useState(1);

  const handleNext = () => {
    setStep((prevStep) => prevStep + 1);
  };
  const handlePrev = () => {
    setStep((prevStep) => prevStep - 1);
  };
  const handleCancel = () => {
    setStep(1);
    navigate(`${PATHS.ROOT}${PATHS.ECP_CONFIGURATION}`);
  };
  const handleSave = () => {
    // FIXME 저장 로직 구현
  };

  return (
    <FormProvider {...method}>
      <ProgressBar
        totalSteps={3}
        currentStep={step}
        stepLabels={['기본 정보', '세션 정보', '프로그램 정보']}
        activeColor={'brown02'}
      />
      <div>
        {/** step 1 : 기본정보 */}
        {step === 1 && <ECPFormStep1 step={step} onNext={handleNext} handleCancel={handleCancel} />}
        {/** step 2 : 세션정보 */}
        {step === 2 && <ECPFormStep2 step={step} onNext={handleNext} onPrev={handlePrev} />}
        {/** step 3 : 프로그램 정보 */}
        {step === 3 && <ECPFormStep3 step={step} onPrev={handlePrev} handleSave={handleSave} />}
      </div>
    </FormProvider>
  );
};

export default ECPConfigurationEdit;
