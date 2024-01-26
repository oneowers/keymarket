package main

import (
	"encoding/json"
	"fmt"
	"net/http"
	"strings"

	"github.com/PuerkitoBio/goquery"
	"github.com/aws/aws-lambda-go/events"
	"github.com/aws/aws-lambda-go/lambda"
)

type Product struct {
	ID           int    `json:"id"`
	Title        string `json:"title"`
	VariantTitle string `json:"variant-title"`
	Price        string `json:"price"`
	Image        string `json:"image"`
	Image1       string `json:"image1"`
	Link         string `json:"link"`
}


func handler(request events.APIGatewayProxyRequest) (*events.APIGatewayProxyResponse, error) {
	textFromBody := request.Body

	// Assuming you have a valid URL in textFromBody
	body, err := scrapeBrostore(textFromBody)
	fmt.Println("URL: ", textFromBody)

	if err != nil {
		return &events.APIGatewayProxyResponse{
			StatusCode: 500,
			Body:       "Error scraping data",
			Headers:    map[string]string{
				"Content-Type": "application/json",
				"Access-Control-Allow-Origin": "*",
				// Add other necessary CORS headers if needed
			},
		}, err
	}

	return &events.APIGatewayProxyResponse{
		StatusCode: 200,
		Body:       body,
		Headers:    map[string]string{
			"Content-Type": "application/json",
			"Access-Control-Allow-Origin": "*",
			// Add other necessary CORS headers if needed
		},
	}, nil
}

func scrapeBrostore(url string) (string, error) {
	var products []Product

	client := &http.Client{}
	req, err := http.NewRequest("GET", "https://brostore.uz/collections/" + url + "/", nil)
	if err != nil {
		fmt.Println("Error creating request:", err)
		return "", err
	}
	req.Header.Set("User-Agent", "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.3")

	fmt.Println("GET: ", "https://brostore.uz/collections/" + url + "/")

	// Perform the request
	resp, err := client.Do(req)
	if err != nil {
		fmt.Println("Error making request:", err)
		return "", err
	}
	defer resp.Body.Close()

	// Check if the request was successful (status code 200)
	if resp.StatusCode != http.StatusOK {
		fmt.Printf("Failed to retrieve data. Status Code: %d\n", resp.StatusCode)
		return "", fmt.Errorf("Failed to retrieve data. Status Code: %d", resp.StatusCode)
	}

	// Use goquery to parse the HTML response
	doc, err := goquery.NewDocumentFromReader(resp.Body)
	if err != nil {
		fmt.Println("Error parsing HTML:", err)
		return "", err
	}

	doc.Find(".product-card.text-center.product-card--content-spacing-false.product-card--border-false.has-shadow--false").Each(func(i int, s *goquery.Selection) {
		title := strings.TrimSpace(s.Find(".product-card-title").Text())
		price := strings.TrimSpace(s.Find(".amount").Text())
		imageURL, _ := s.Find(".product-primary-image").Attr("data-srcset")
		imageURL = "https:" + strings.Fields(imageURL)[0]

		imageURL1, _ := s.Find(".product-secondary-image").Attr("data-srcset")
		imageURL1 = "https:" + strings.Fields(imageURL1)[0]  // Fix this line

		// Find the parent container that contains the link
		parent := s.Find(".product-card-title").Parent()

		// Find the link within the parent container
		linkSelection := parent.Find("a").First()
		link, exists := linkSelection.Attr("href")

		if exists {
			link = "https://brostore.uz" + link

			product := Product{
				ID:    i + 1,
				Title: title,
				Price: price,
				Image: imageURL,
				Image1: imageURL1,
				Link:  link,
			}
			products = append(products, product)
		} else {
			fmt.Println("Link does not exist")
		}
	})

	// Convert products to JSON
	jsonResponse, err := json.Marshal(products)
	if err != nil {
		fmt.Println("Error marshaling JSON:", err)
		return "", err
	}

	return string(jsonResponse), nil
}

func main() {
	lambda.Start(handler)
}
