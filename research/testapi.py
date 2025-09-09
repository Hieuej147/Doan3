import asyncio
from fake_useragent import UserAgent
import aiohttp
import html2text
from dotenv import load_dotenv
load_dotenv()
from tavily import AsyncTavilyClient
from readability import Document
from bs4 import BeautifulSoup
# Init
_USER_AGENT = UserAgent().random
tavily_client = AsyncTavilyClient()

async def download_resource_clean(url: str):
    try:
        async with aiohttp.ClientSession() as session:
            async with session.get(url, headers={"User-Agent": _USER_AGENT}, timeout=aiohttp.ClientTimeout(total=10)) as response:
                response.raise_for_status()
                html_content = await response.text()
                doc = Document(html_content)
                summary_html = doc.summary()  # phần nội dung chính
                soup = BeautifulSoup(summary_html, 'html.parser')
                text_only = soup.get_text()
                return text_only.strip()
    except Exception as e:
        return f"[Download Error] {e}"

async def extract_resource(url: str):
    try:
        response = await tavily_client.extract(urls=[url])
        results = response.get("results", [])
        if not results:
            return "[Extract Error] No content returned from Tavily."
        return results[0].get("raw_content", "[Extract Error] No raw_content.")
    except Exception as e:
        return f"[Extract Error] {e}"


async def test_url(url: str):
    print(f"▶️ Testing URL: {url}\n")

    # print("🔽 [1] download_resource() - markdown version:\n")
    # markdown_result = await download_resource_clean(url)
    # print(markdown_result[:5000] + "\n...")  # in 1000 ký tự đầu tiên

    print("\n🔽 [2] tavily_extract() - raw text version:\n")
    raw_result = await extract_resource(url)
    print(raw_result[:5000] + "\n...")

# Example usage:
if __name__ == "__main__":
    asyncio.run(test_url("https://docs.ultralytics.com/vi/models/yolov10/"))
