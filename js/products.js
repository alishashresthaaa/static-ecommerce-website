// Description: Contains the list of products and their details.
const plans_list = [
    {
        id: 1,
        name: "Basic",
        full_name: "Basic Playlist Generator",
        price: "$9.99",
        frequency: "per month",
        description: " Generate up to 5 personalized playlists per month based on user preferences.",
        features: ["Basic customization options", "Genre selection", "Mood-based playlists"],
        image: "images/plans.png",
        color: "#D9D8D8",
    },
    {
        id: 2,
        name: "Standard",
        full_name: "Standard Playlist Generator",
        price: "$19.99",
        frequency: "per month",
        description: "Generate up to 20 personalized playlists per month with advanced customization.",
        features: ["Playlist length", "More genres", "Mood combinations"],
        image: "images/plans.png",
        color: "#b9b8b3",
    },
    {
        id: 3,
        name: "Premium",
        full_name: "Premium Playlist Generator",
        price: "$29.99",
        frequency: "per month",
        description: "Unlimited personalized playlists with full customization and additional features.",
        features: ["Integration with other music services", "Collaborative playlists", "Advanced analytics"],
        image: "images/plans.png",
        color: "#9c8f54",
    },
    {
        id: 4,
        name: "Family",
        full_name: "Family Playlist Generator",
        price: "$49.99",
        frequency: "per month",
        description: "All the features of the Premium Plan for up to 6 family members.",
        features: ["Shared playlists", "Individual profiles", "Parental controls"],
        image: "images/plans.png",
        color: "#83637c",
    },
    {
        id: 5,
        name: "Business",
        full_name: "Business Playlist Generator",
        price: "$59.99+",
        frequency: "based on needs",
        description: "Custom solutions for businesses to create playlists for events, stores, or work environments.",
        features: ["Tailored playlist solutions", "Team collaboration features", "Integration with business tools"],
        image: "images/plans.png",
        color: "#77a789",
    },
    {
        id: 6,
        name: "Enterprise",
        full_name: "Enterprise Playlist Generator",
        price: "$75.99+",
        frequency: "based on scale and needs",
        description: "Advanced features for large organizations with extensive playlist needs and custom requirements.",
        features: ["Additional support", "Analytics", "Dedicated account management"],
        image: "images/plans.png",
        color: "#7a74ac",
    },
    {
        id: 7,
        name: "One-Time Purchase",
        full_name: "Lifetime Access",
        price: "$149.99",
        frequency: "one-time payment",
        description: "One-time payment for lifetime access to all features.",
        features: ["All features from the Premium Plan", "Lifetime updates", "Priority support"],
        image: "images/plans.png",
        color: "#d6ca88",
    },
    {
        id: 8,
        name: "Add-Ons",
        full_name: "Additional Playlist Packs",
        price: "$4.99",
        frequency: "per pack",
        description: "Extra playlist packs with specialized themes or genres.",
        features: ["Pre-curated playlists for specific occasions or genres"],
        image: "images/plans.png",
        color: "#818181",
    },
];
const products_list_element = $(".products__list");
const product_details_element = $(".product__details");
var product_list_string = "";
var height_before = $('header').height() + $('.products__container').height() + $('footer').height() + 80; // calculating the height of the page before populating the products list
$(document).ready(function () {
    populate_products_list();
    load_details(1);
    $('#showcase').height(height_before + products_list_element.height()); // Updating the height of the showcase section after populating the products list
});

function populate_products_list() {
    products_list_element.empty();
    $.each(plans_list, (index, plan) => {
        const product_features = plan.features.map((feature) => `<li>${feature}</li>`).join("");
        const product_element = `
                    <div class="products__item" id="item${plan.id}">
                        <div class="products__item__header">
                            <span class="products__item__header__title">${plan.name}</span>
                            <span class="products__item__header__price">${plan.price}</span>
                            <small>${plan.frequency}</small>
                        </div>
                        <div class="products__item__body">
                            <div class="products__item__body__list">
                                <ul>
                                    ${product_features}
                                </ul>
                            </div>
                            <button class="btn btn-primary" onclick="load_details(${plan.id});">Get Plan</button>
                        </div>
                    </div>
        `;
        products_list_element.append(product_element);
    });
}

function load_details(id) {
    const plan = plans_list.find((plan) => plan.id == id);
    product_details_element.empty();
    const product_element = `
                <div class="product__details__container">
                    <center>
                        ${plan.name}
                    </center>
                    <div class="product__details__main">
                        <img src="${plan.image}" alt="${plan.full_name}" class="product__details__image" />
                        <div class="product__details__info">
                            <h4>${plan.full_name}</h4>
                            <h2>${plan.price}</h2>
                            <p>${plan.description}</p>
                            <button class="btn btn-primary">Buy Now</button>
                        </div>
                    </div>
                </div>
    `;
    product_details_element.append(product_element);
    $('.product__details__container').css("background-color", plan.color);
}