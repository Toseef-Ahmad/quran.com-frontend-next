import { useDispatch } from 'react-redux';

import { setIsSettingsDrawerOpen } from '@/redux/slices/navbar';
import OnboardingGroup from '@/types/OnboardingGroup';

interface UseHandleOnboardingEventsParams {
  group: OnboardingGroup;
  index: number;
  isLastStep: boolean; // is the current step the last step of the current group
}

type EventHookResult = {
  // a number in milliseconds that will be used to delay
  // the proceeding of the action (prev/next).
  delay?: number;

  // if false, the action (prev/next) will not proceed automatically.
  // this is useful when you want another component to handle the proceeding.
  automaticallyProceed?: boolean;
};

interface UseHandleOnboardingEventsReturn {
  beforePrev: () => EventHookResult;
  beforeNext: () => EventHookResult;
  beforeSkip: () => EventHookResult;
}

/**
 * This hook is an abstraction of the custom logic required for different parts of the onboarding. Example: Opening the settings drawer when the user clicks on "Next" in the settings onboarding.
 *
 * @param {UseHandleOnboardingEventsParams} params
 * @returns {UseHandleOnboardingEventsReturn}
 */
const useHandleOnboardingEvents = ({
  group,
  index,
  isLastStep,
}: UseHandleOnboardingEventsParams): UseHandleOnboardingEventsReturn => {
  const dispatch = useDispatch();

  const beforePrev = (): EventHookResult => {
    if (group === OnboardingGroup.SETTINGS && index === 1) {
      // when the user clicks "back" in
      // the second step of the settings onboarding, close the drawer
      dispatch(setIsSettingsDrawerOpen(false));

      // add a delay to the animation so that the drawer has time to close
      // tip: this comes from Drawer.module.scss (--transition-regular)
      return { delay: 400 };
    }

    return {};
  };

  const beforeNext = (): EventHookResult => {
    if (group === OnboardingGroup.SETTINGS) {
      if (isLastStep) {
        // when the user clicks "finish" in
        // the last step of the settings onboarding, close the drawer
        dispatch(setIsSettingsDrawerOpen(false));
        return {};
      }

      if (index === 0) {
        // if the user clicks "next" in the first step of the settings onboarding,
        // open the drawer
        dispatch(setIsSettingsDrawerOpen(true));

        // we'll let the drawer handle the proceeding when it's done opening
        return { automaticallyProceed: false };
      }
    }

    return {};
  };

  const beforeSkip = (): EventHookResult => {
    return {};
  };

  return {
    beforePrev,
    beforeNext,
    beforeSkip,
  };
};

export default useHandleOnboardingEvents;
