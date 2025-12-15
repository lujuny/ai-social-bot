from abc import ABC, abstractmethod

class BasePublisher(ABC):
    """所有平台发布器的基类"""
    
    def __init__(self, account_data: dict):
        self.account = account_data
        
    @abstractmethod
    def login(self):
        """登录逻辑 (通常通过加载Cookie)"""
        pass
        
    @abstractmethod
    def publish(self, content_data: dict) -> str:
        """
        发布内容
        :param content_data: {title: str, content: str, images: [path], tags: []}
        :return: Success message or Post ID
        """
        pass
