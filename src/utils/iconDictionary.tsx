import React from 'react';
import {
  BellIcon,
  CheckCircledIcon,
  CrossCircledIcon,
  ExclamationTriangleIcon,
  InfoCircledIcon,
  EyeOpenIcon,
  TargetIcon,
  CameraIcon,
  PlayIcon,
  StopIcon,
  GearIcon,
  PersonIcon,
  HomeIcon,
  MagnifyingGlassIcon,
} from '@radix-ui/react-icons';

export type IconName = 
  | 'bell'
  | 'check'
  | 'error'
  | 'warning'
  | 'info'
  | 'eye'
  | 'target'
  | 'camera'
  | 'play'
  | 'stop'
  | 'gear'
  | 'person'
  | 'home'
  | 'search';

export const iconDictionary: Record<IconName, React.ComponentType<any>> = {
  bell: BellIcon,
  check: CheckCircledIcon,
  error: CrossCircledIcon,
  warning: ExclamationTriangleIcon,
  info: InfoCircledIcon,
  eye: EyeOpenIcon,
  target: TargetIcon,
  camera: CameraIcon,
  play: PlayIcon,
  stop: StopIcon,
  gear: GearIcon,
  person: PersonIcon,
  home: HomeIcon,
  search: MagnifyingGlassIcon,
};

export const getIcon = (iconName: string, className: string = "w-6 h-6"): React.ReactElement => {
  const IconComponent = iconDictionary[iconName as IconName];
  
  if (!IconComponent) {
    // Fallback to bell icon if the specified icon doesn't exist
    const FallbackIcon = iconDictionary.bell;
    return <FallbackIcon className={className} />;
  }
  
  return <IconComponent className={className} />;
}; 