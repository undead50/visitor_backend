def selenium_script(url):
  from selenium import webdriver
  from selenium.webdriver.common.by import By
  from selenium.webdriver.common.keys import Keys
  import time

  try:
    # Replace 'chromedriver.exe' with the path to your WebDriver executable
    driver_path = 'chromedriver.exe'

    # Initialize the WebDriver (in this case, we're using Chrome)
    driver = webdriver.Chrome()

    # Open the Google homepage
    driver.get("https://www.google.com")

    # Find the search input element by name (name="q")
    search_box = driver.find_element(By.NAME, 'q')

    # Enter a search query
    search_box.send_keys("OpenAI")

    # Submit the search (press Enter)
    search_box.send_keys(Keys.RETURN)

    # Wait for the search results to load (you can adjust the wait time)
    time.sleep(5)

    # Click on the first search result (assuming it's a link)
    search_results = driver.find_elements(By.CSS_SELECTOR, ".g")
    if search_results:
        first_result = search_results[0]
        first_result.click()
    # Wait for a few seconds (you can add more actions here)
    time.sleep(5)
  except Exception as e:
     print(e)
  finally:
     #Close the driver
     driver.quit()

