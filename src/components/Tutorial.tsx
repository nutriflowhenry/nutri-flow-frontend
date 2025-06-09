'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { FaRobot } from 'react-icons/fa';

interface TutorialStep {
    title: string;
    content: string;
    position: string;
    target: string | null;
}

interface TutorialProps {
    showTutorial: boolean;
    currentStep: number;
    tutorialSteps: TutorialStep[];
    handleNextStep: () => void;
    handleSkipTutorial: () => void;
}


const Tutorial = ({
    showTutorial,
    currentStep,
    tutorialSteps,
    handleNextStep,
    handleSkipTutorial,
}: TutorialProps) => {
    return (
        <AnimatePresence>
            {showTutorial && (
                <>
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 0.7 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black z-40"
                    />

                    <motion.div
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.8 }}
                        transition={{ type: 'spring', damping: 20 }}
                        className={`fixed z-50 bg-[#F4EAE0] p-6 rounded-2xl shadow-xl max-w-xs md:max-w-sm border-2 border-[#6b8f71] 
                            ${tutorialSteps[currentStep].position === 'top' ? 'md:top-44 md:left-32' : ''}
                            ${tutorialSteps[currentStep].position === 'bottom' ? 'bottom-20 md:right-28' : ''}
                            ${tutorialSteps[currentStep].position === 'left' ? 'md:top-44 md:right-32' : ''}
                            ${tutorialSteps[currentStep].position === 'right' ? ' md:top-1/2' : ''}
                            ${tutorialSteps[currentStep].position === 'center' ? 'md:top-40 transform -translate-x-1/2 -translate-y-1/2' : ''}`}
                    >
                        <div className="flex items-start mb-4">
                            <div className="bg-[#6b8f71] p-3 rounded-full mr-3">
                                <FaRobot className="text-2xl text-white" />
                            </div>
                            <div>
                                <h3 className="text-xl font-bold text-[#5a5f52]">
                                    {tutorialSteps[currentStep].title}
                                </h3>
                                <p className="text-[#5a5f52]">
                                    {tutorialSteps[currentStep].content}
                                </p>
                            </div>
                        </div>

                        <div className="flex justify-between mt-4">
                            <button
                                onClick={handleSkipTutorial}
                                className="text-sm text-[#5a5f52] hover:text-[#6b8f71]"
                            >
                                Saltar tutorial
                            </button>
                            <button
                                onClick={handleNextStep}
                                className="bg-[#6b8f71] text-white px-4 py-2 rounded-lg hover:bg-[#5a7c62] transition-colors"
                            >
                                {currentStep === tutorialSteps.length - 1 ? 'Comenzar' : 'Siguiente'}
                            </button>
                        </div>

                        {/* Flecha indicadora */}
                        {tutorialSteps[currentStep].target && (
                            <motion.div
                                animate={{ y: [0, 10, 0] }}
                                transition={{ repeat: Infinity, duration: 1.5 }}
                                className={`absolute w-6 h-6 text-[#6b8f71] 
                                    ${tutorialSteps[currentStep].position === 'top' ? 'right-[-24px] top-1/2 transform -translate-y-1/2 -rotate-90' : ''}
                                    ${tutorialSteps[currentStep].position === 'bottom' ? 'right-[-24px] top-1/2 transform -translate-y-1/2 -rotate-90' : ''}
                                    ${tutorialSteps[currentStep].position === 'left' ? 'bottom-[-24px] left-1/2 transform -translate-x-1/2 rotate-180' : ''}
                                    ${tutorialSteps[currentStep].position === 'right' ? 'bottom-[-24px] left-1/2 transform -translate-x-1/2 rotate-180' : ''}`}
                            >
                                <svg viewBox="0 0 24 24" fill="currentColor">
                                    <path d="M7 10l5 5 5-5z" />
                                </svg>
                            </motion.div>
                        )}
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
};

export default Tutorial;