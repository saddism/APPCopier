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
    nav: {
      products: string;
      upload: string;
      login: string;
      register: string;
      dashboard: string;
      signOut: string;
    };
    app: {
      title: string;
      description: string;
      startAnalysis: string;
    };
    meta: {
      description: string;
      keywords: string;
    };
    products: {
      latestTitle: string;
      viewMore: string;
      list: {
        title: string;
        description: string;
      };
      empty: {
        title: string;
        description: string;
        uploadButton: string;
      };
      notFound: {
        title: string;
        description: string;
        backToList: string;
      };
      backToList: string;
      demo: {
        title: string;
        description: string;
        category: string;
      };
      ecommerce: {
        title: string;
        description: string;
        category: string;
      };
    };
    upload: UploadTranslation;
    footer: {
      copyright: string;
    };
  }
}

const translations: Translations = {
  en: {
    nav: {
      products: 'Products',
      upload: 'Upload',
      login: 'Sign In',
      register: 'Register',
      dashboard: 'Dashboard',
      signOut: 'Sign Out'
    },
    app: {
      title: 'APP Video Analysis System',
      description: 'Upload your app screen recording for detailed feature analysis and PRD generation',
      startAnalysis: 'Start Analysis'
    },
    meta: {
      description: 'APP Video Analysis System - Intelligent app feature analysis and PRD generation',
      keywords: 'APP analysis,video analysis,PRD generation,feature analysis'
    },
    products: {
      latestTitle: 'Latest Analysis Cases',
      viewMore: 'View More',
      list: {
        title: 'Analyzed Products',
        description: 'Browse analyzed apps and their detailed feature analysis and PRD documents.'
      },
      empty: {
        title: 'No Analysis Cases Yet',
        description: 'Be the first to upload a video for analysis',
        uploadButton: 'Upload Video Now'
      },
      notFound: {
        title: 'Product Not Found',
        description: 'The product may have been deleted or does not exist',
        backToList: 'Back to Product List'
      },
      backToList: '← Back to List',
      demo: {
        title: 'Sample Social App Analysis',
        description: 'In-depth analysis of core features, user interaction flows, and technical implementation of a social app',
        category: 'Social App'
      },
      ecommerce: {
        title: 'E-commerce Platform Analysis',
        description: 'Detailed analysis of shopping process, payment system, and product management features',
        category: 'E-commerce App'
      }
    },
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
    },
    footer: {
      copyright: '© 2024 APPCopier. All rights reserved.'
    }
  },
  zh: {
    nav: {
      products: '产品列表',
      upload: '上传视频',
      login: '登录',
      register: '注册',
      dashboard: '控制台',
      signOut: '退出'
    },
    app: {
      title: 'APP视频分析系统',
      description: '上传您的APP操作视频，获取详细的功能分析和PRD文档',
      startAnalysis: '立即开始分析'
    },
    meta: {
      description: 'APP视频分析系统 - 智能分析APP功能和生成PRD文档',
      keywords: 'APP分析,视频分析,PRD生成,功能分析'
    },
    products: {
      latestTitle: '最新分析案例',
      viewMore: '查看更多',
      list: {
        title: '已分析产品',
        description: '浏览已分析的APP产品列表，查看详细功能分析和PRD文档。'
      },
      empty: {
        title: '暂无分析案例',
        description: '成为第一个上传视频进行分析的用户',
        uploadButton: '立即上传视频'
      },
      notFound: {
        title: '未找到产品',
        description: '该产品可能已被删除或不存在',
        backToList: '返回产品列表'
      },
      backToList: '← 返回列表',
      demo: {
        title: '示例社交应用分析',
        description: '深入分析社交应用的核心功能、用户交互流程和技术实现方案',
        category: '社交应用'
      },
      ecommerce: {
        title: '电商平台功能分析',
        description: '电商应用的购物流程、支付系统和商品管理功能详细分析',
        category: '电商应用'
      }
    },
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
    },
    footer: {
      copyright: '© 2024 APPCopier. 保留所有权利。'
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
  let currentLanguage: Language = defaultLanguage;

  return function useTranslation() {
    const t = (key: string) => getTranslation(key, currentLanguage);
    const setLanguage = (lang: Language) => {
      currentLanguage = lang;
    };
    return { t, setLanguage };
  };
}

export const useTranslation = createTranslationHook();
