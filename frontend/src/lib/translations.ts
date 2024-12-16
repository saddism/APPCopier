type Language = 'zh' | 'en';

interface TranslationError {
  noFile: string;
  invalidType: string;
  verifyEmail: string;
  trialUsed: string;
  sizeLimitExceeded: string;
  default: string;
}

interface UploadTranslation {
  title: string;
  description: string;
  selectVideo: string;
  selected: string;
  uploadButton: string;
  uploading: string;
  success: string;
  error: TranslationError;
}

interface Translations {
  [key: string]: {
    upload: UploadTranslation;
  }
}

const translations: Translations = {
  en: {
    upload: {
      title: 'Upload Video',
      description: 'Upload your app screen recording video for detailed analysis and PRD generation.',
      selectVideo: 'Select video file',
      selected: 'Selected',
      uploadButton: 'Upload Video',
      uploading: 'Uploading...',
      success: 'Video uploaded successfully!',
      error: {
        noFile: 'Please select a video file first',
        invalidType: 'Please select a video file',
        verifyEmail: 'Please verify your email first',
        trialUsed: 'Trial used up, please upgrade to premium',
        sizeLimitExceeded: 'Upload failed, please check if video size exceeds 500MB or try again',
        default: 'Upload failed, please try again'
      }
    }
  },
  zh: {
    upload: {
      title: '上传视频',
      description: '上传您的APP操作视频，获取详细的功能分析和PRD文档。',
      selectVideo: '选择视频文件',
      selected: '已选择',
      uploadButton: '上传视频',
      uploading: '上传中...',
      success: '视频上传成功！',
      error: {
        noFile: '请先选择视频文件',
        invalidType: '请选择视频文件',
        verifyEmail: '请先验证邮箱',
        trialUsed: '试用次数已用完，请升级会员',
        sizeLimitExceeded: '上传出错，请检查视频大小是否超过500MB或重试',
        default: '上传失败，请重试'
      }
    }
  }
};

export const defaultLanguage: Language = 'zh';

export function getTranslation(key: string, language: Language = defaultLanguage): string {
  const keys = key.split('.');
  let value: any = translations[language];

  for (const k of keys) {
    if (value && typeof value === 'object') {
      value = value[k];
    } else {
      return key;
    }
  }

  return typeof value === 'string' ? value : key;
}

export function createTranslationHook() {
  return function useTranslation() {
    const t = (key: string) => getTranslation(key);
    return { t };
  };
}

export const useTranslation = createTranslationHook();
