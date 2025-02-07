var jsonData = { apikey: "aad1a7be80725e56ec70865a881c4093", Password: "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" },
    collections_json = "/collections.json";
$(function () {
    if (("/" === window.location.pathname && "/" !== window.location.pathname && $("body.template-index").length && $("body.template-index").css("opacity", "1"), window.location.pathname, $("body.template-collection").length)) {
        let t = $(".filters-toolbar").find(".filters-toolbar__item-child").eq(0),
            e = $(".filters-toolbar").find(".filters-toolbar__item-child").eq(1),
            i = "";
        $.ajax({
            url: collections_json,
            type: "get",
            dataType: "json",
            data: jsonData,
            success: function (t) {
                var e = t.collections;
                for (let t = 0; t < e.length; t++) i += '<li><a href="/collections/' + e[t].handle + '">' + e[t].title + "</a></li>";
                "/" !== window.location.pathname
                    ? $('a[href="' + window.location.pathname + '"]')
                          .parent()
                          .addClass("selected")
                    : $('a[href="/collections/full-packs"]').parent().addClass("selected");
            },
            error: function (t, e) {
                console.log(arguments), console.log(" Can't do because: " + e);
            },
        });
        let l = "",
            s = "";
        t.find("option:not([disabled])").each(function () {
            "title-ascending" !== $(this).attr("value") &&
                "title-descending" !== $(this).attr("value") &&
                "manual" !== $(this).attr("value") &&
                ("selected" === $(this).attr("selected")
                    ? (l += '<li class="selected" data-value="' + $(this).attr("value") + '">' + $(this).text() + "</li>")
                    : (l += '<li data-value="' + $(this).attr("value") + '">' + $(this).text() + "</li>"));
        }),
            e.find("option:not([disabled])").each(function () {
                $(this).attr("value").indexOf("?") > -1
                    ? ("blue" !== $(this).attr("value").split("/")[3].split("?")[0] &&
                          "yellow" !== $(this).attr("value").split("/")[3].split("?")[0] &&
                          "orange" !== $(this).attr("value").split("/")[3].split("?")[0] &&
                          "red" !== $(this).attr("value").split("/")[3].split("?")[0] &&
                          "green" !== $(this).attr("value").split("/")[3].split("?")[0] &&
                          "purple" !== $(this).attr("value").split("/")[3].split("?")[0] &&
                          "black" !== $(this).attr("value").split("/")[3].split("?")[0] &&
                          "white" !== $(this).attr("value").split("/")[3].split("?")[0]) ||
                      ("selected" === $(this).attr("selected")
                          ? ((s += '<li class="selected" data-value="' + $(this).attr("value") + '" data-color="' + $(this).attr("value").split("/")[3].split("?")[0] + '">' + $(this).text() + "</li>"),
                            $(".filters-toolbar .filters-custom .filter-color span").text($(this).text()))
                          : (s += '<li data-value="' + $(this).attr("value") + '" data-color="' + $(this).attr("value").split("/")[3].split("?")[0] + '">' + $(this).text() + "</li>"))
                    : ("blue" !== $(this).attr("value").split("/")[3] &&
                          "yellow" !== $(this).attr("value").split("/")[3] &&
                          "orange" !== $(this).attr("value").split("/")[3] &&
                          "red" !== $(this).attr("value").split("/")[3] &&
                          "green" !== $(this).attr("value").split("/")[3] &&
                          "purple" !== $(this).attr("value").split("/")[3] &&
                          "black" !== $(this).attr("value").split("/")[3] &&
                          "white" !== $(this).attr("value").split("/")[3]) ||
                      ("selected" === $(this).attr("selected")
                          ? ((s += '<li class="selected" data-value="' + $(this).attr("value") + '" data-color="' + $(this).attr("value").split("/")[3] + '">' + $(this).text() + "</li>"),
                            $(".filters-toolbar .filters-custom .filter-color span").text($(this).text()))
                          : (s += '<li data-value="' + $(this).attr("value") + '" data-color="' + $(this).attr("value").split("/")[3] + '">' + $(this).text() + "</li>"));
            }),
            $(".filters-custom .filter-sort ul").html(l),
            $(".filters-custom .filter-sort  span").html($(".filters-custom .filter-sort ul li.selected").html())
            $(".filters-custom .filter-color ul").html(s),
            $(".filters-custom > div > span").on("click", function () {
                $(".filters-custom .filter").removeClass('opened')
                $(this).parent().toggleClass("opened");
            }),
            $(document).on("click", function(event){
                var $trigger = $(".filters-custom > div.filter");
                if(!$trigger.has(event.target).length ){
                    $trigger.removeClass("opened");
                }            
            });
            $(".filters-custom ul li").on("click", function () {
                let t, e;
                if ($(this).parents(".filter").hasClass("filter-sort")) {
                    ($(this).parent().find("li").removeClass("selected"), $(this).addClass("selected"), (t = $(this).attr("data-value")),$(".filters-toolbar .filters-custom .filter-sort span").text($(this).text()), (e = document.querySelector("#SortBy")))
                } else if ($(this).hasClass("selected")) {
                    (t = "/collections/full-packs"), $(this).removeClass("selected")
                } else if (!$(this).parents(".filter").hasClass("filter-tags")){
                    (t = $(this).attr("data-value")), $(this).parent().find("li").removeClass("selected"), $(this).addClass("selected"), $(".filters-toolbar .filters-custom .filter-color span").text($(this).text()),
                      (e = document.querySelector("#FilterTags"))
                }
                // $(this).parents(".filter").hasClass("filter-sort")
                //     ? ($(this).parent().find("li").removeClass("selected"), $(this).addClass("selected"), (t = $(this).attr("data-value")), (e = document.querySelector("#SortBy")))
                //     : ($(this).hasClass("selected")
                //           ? ((t = "/collections/full-packs"), $(this).removeClass("selected"))
                //           : ((t = $(this).attr("data-value")), $(this).parent().find("li").removeClass("selected"), $(this).addClass("selected"), $(".filters-toolbar .filters-custom .filter-color span").text($(this).text())),
                //       (e = document.querySelector("#FilterTags")));
                let i = $(this);
                console.log({t,e})
                setTimeout(function () {
                    (e.value = t), e.dispatchEvent(new Event("change")), i.parents(".filter").removeClass("opened");
                }, 500);
            }),

            localStorage.removeItem("collection-link"),
            localStorage.removeItem("collection-title");

            localStorage.setItem("collection-link", $(".collections-list .selected a").attr("href")),
            localStorage.setItem("collection-title", $(".collections-list .selected a").text());
    }
    if ($("body.template-product").length) {
        $(".product-breadcrumbs .collection-link").attr("href", localStorage.getItem("collection-link")),
        $(".product-breadcrumbs .collection-link").text(localStorage.getItem("collection-title"));
        // $(".owl-carousel").owlCarousel({ loop: !1, margin: 8, nav: !0, dots: !1, responsive: { 0: { items: 3 }, 600: { items: 3 }, 1000: { items: 4 } } });
        let e = $("header ul.site-nav li").eq(0).find("a").attr("href");
        $(".product-breadcrumbs").find("a.store-link").attr("href", e);
        let i = document.querySelector("#SingleOptionSelector-0");
        if($('.product_video').length) {
            
            $("#streamlabs").length && $("#streamlabs").insertBefore(".product_video")
        } 
        if (
            ($(".kudos-select")
                .find("li")
                .each(function () {
                    let t = $(this).attr("data-name"),
                        e = parseInt($(this).attr("data-price")) / 100,
                        i = $(".product-single .product__price .price-item").eq(0).text().charAt(0);
                    $(this).html(t + " - " + i + e);
                }),
            $(".kudos-select").find("li").eq(i.selectedIndex).addClass("selected"),
            $(".kudos-select > span").css("width", $(".kudos-select").find("li").eq(i.selectedIndex).css("width")),
            $("body").on("click", ".kudos-select li", function () {
                let t;
                $(".kudos-select").find("li").removeClass("selected"),
                    $(this).addClass("selected"),
                    0 === $(this).index() ? (t = 4) : 1 === $(this).index() && (t = parseInt($(".kudos-select").css("width").split("px")[0]) - parseInt($(this).css("width").split("px")[0]) - 5),
                    $(".kudos-select > span").css({ width: $(this).css("width"), left: t });
                let e = $(this).text().split(" - ")[0];
                (i.value = e), i.dispatchEvent(new Event("change"));
            }),
            setTimeout(function () {
                $(".kudos-select li").eq(i.selectedIndex).trigger("click");
            }, 100),
            setTimeout(function () {
                $(".kudos-select > span").addClass("visible");
            }, 200),
            $(".product-single__description .scrollable-wrapper table").length)
        ) {
           
        }

        $(window).on('resize', function () {
            console.log()
            $(".kudos-select > span").css({ width: $(".kudos-select").find("li").eq(i.selectedIndex).css("width"), left: parseInt($(".kudos-select").css("width").split("px")[0]) - parseInt($(".kudos-select").find("li").eq(i.selectedIndex).css("width").split("px")[0]) - 5 })
        })

        $("body").on("click", ".product__setup button[data-link]", function () {
            $(this).attr("data-link").indexOf("youtu.be") > -1 &&
                ($(".pi-popup .pi-popup_inner").html(
                    '<div class="videoWrapper"><iframe src="https://www.youtube.com/embed/' +
                        $(this).attr("data-link").split("youtu.be/")[1] +
                        '"></iframe></div><div class="popup-close"><svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M14 1.41L12.59 0L7 5.59L1.41 0L0 1.41L5.59 7L0 12.59L1.41 14L7 8.41L12.59 14L14 12.59L8.41 7L14 1.41Z" fill="black"/></svg></div>'
                ),
                $(".pi-popup").addClass("on-screen"));
        })
            $("body").on("click", ".pi-popup .popup-close", function () {
                $(".pi-popup").removeClass("on-screen"), $(".pi-popup .pi-popup_inner").html("");
            })
            $(document).mouseup(function (t) {
                var e = $(".pi-popup_inner");
                e.is(t.target) || 0 !== e.has(t.target).length || ($(".pi-popup").removeClass("on-screen"), $(".pi-popup .pi-popup_inner").html(""));
            })

        
        $(".product-tags")
            .find("span")
            .each(function () {
                $(this)
                    .find("a")
                    .attr("href", "/collections/" + localStorage.getItem("collection-link").split("/")[2] + "/" + $(this).find("a").attr("href").split("/")[3]);
                });
                
    }
    $("body.template-customers-order").length && $(".placed_at").html($(".placed-hidden").html()),
        $("body.template-search").length &&
            $(".product-card").each(function () {
                ("Privacy Policy" !== $(this).find(".product-card__title").text() && "Terms & Conditions" !== $(this).find(".product-card__title").text() && "Cookie Policy" !== $(this).find(".product-card__title").text()) ||
                    $(this).parents(".grid__item").hide();
            });
    
    
        $(window).width() < 750 &&
            ($(".search-toolbar form").on("click", function () {
                $(this).addClass("search-opened");
            }),
            $(document).mouseup(function (t) {
                var e = $(".search-toolbar form");
                e.is(t.target) || 0 !== e.has(t.target).length || $(".search-toolbar form").removeClass("search-opened");
            })),
        $(".iwishProducts").length &&
            ($(".iwishItem").each(function () {
                $(this).find("form").append('<div class="wishButtons"><div class="remove"></div><div class="add-to-cart"></div></div>');
            }),
            $("body").on("click", ".wishButtons .remove", function () {
                $(this).parents("form").find(".iwishMeta .iwishRemoveBtn").trigger("click");
            }),
            $("body").on("click", ".wishButtons .add-to-cart", function () {
                $(this).parents("form").find(".iwishMeta .iwishBuyBtn").trigger("click");
            }));
});
// faq
$(function () {
    const container = $('.faq__title_container')
    
    $(document).on('click', '.faq__title_container', function() {
        $(this).parent().toggleClass('active')
        $(this).next().slideToggle('fast')
    })
})
// faq

// color filter
$(function() {
    $(document).ready(function() {
        const colorFilter = $('.filter-color')
        const colorFilterItem = colorFilter.find('li')
        const selectedColor = colorFilter.find('.selected')
        colorFilter.attr('data-color', selectedColor.attr('data-color'))
    
        $(document).on('click', '.filter-color li', function() {
            colorFilter.attr('data-color', $(this).attr('data-color'))
        })
    })
    
})
// color filter

// video on hover in product card
$(function() {
    $(document).on('mouseenter', '.grid-view-item', function() {
        if ($(this).find('.grid-view-item__video').length) {
            $(this).find('.grid-view-item__video').get(0).play()            
        }
    })
    $(document).on('mouseleave', '.grid-view-item', function() {
        if ($(this).find('.grid-view-item__video').length) {
            $(this).find('.grid-view-item__video').get(0).pause()            
        }
    })
})
// video on hover in product card

// to top button
$(function() {
    const toTopButton = document.querySelector('.toTop')
    window.addEventListener('scroll', () => {
        if (window.pageYOffset > 100 ) {
            toTopButton.classList.add('active')
        } else {
            toTopButton.classList.remove('active')
        }        
    })
})
// to top button

// products per page
const setProductsPerPage = function (value) {

    $.ajax({
        type: "Post",
        url: '/cart.js',
        data: {
            "attributes[pagination]": value
        },

        success: function (data) {
            window.location.reload();
        },

        error: function (xhr, text) {
            console.log({xhr, text})
        },
        dataType: 'json'
    });
}

$(document).on('click', '.limited-view .dropdown-menu span', function() {
    const value = $(this).attr('data-value')
    setProductsPerPage(value)
})

$(document).on('click', '.limited-view label', function() {
    $(this).next().toggleClass('active')
})

// products per page

$(function() {
    if($('body').hasClass('template-product')) {
        const container = document.querySelector('.product_video__banner_container')
    

        if (container) {
            const playButton = document.querySelector('.product_video__play')
            const image = document.querySelector('.product_video__banner_image')
            const link = document.querySelector('.product_video__content').dataset.url
            playButton.addEventListener('click', () => {
                container.innerHTML = `<iframe width="100%" height="100%" src="${link}?autoplay=1" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>`
                playButton.style.display = 'none'
                image.style.display = 'none'
                })
        }

        $(document).on('click', '#to_checkout', function (e) {
            e.preventDefault()
            const variantId = $('#ProductSelect-product-template').val()
            let newurl = `https://kudos.tv/cart/${variantId}:1`
            window.location.href = newurl;
        })
        
        if (window.innerWidth < 1024) {
        const parent = document.querySelector('.product-single__media-group')
        const target = document.querySelector('.product-single__description')
        const emptyBlock = document.querySelector('.product-single__empty_block')
        const productRight = document.querySelector('#product_right')
        
        emptyBlock.style.display = 'none'
        parent.insertBefore(productRight, target);
        }
    }
    
})

// collection
$(function() {
    if($('body').hasClass('template-collection')) {
        const swiper = new Swiper('.collection_banner_slider', {
            loop:true,
            slidesPerView: 2,
            spaceBetween: 10,
            centeredSlides: true,
            navigation: {
              nextEl: '.swiper-button-next',
              prevEl: '.swiper-button-prev',
            },
            breakpoints: {
              768: {
                slidesPerView: 3,
                spaceBetween: 20,
              },
              1024: {
                slidesPerView: 4,
                spaceBetween: 30,
              },
            },
          });
        
          if (localStorage.getItem("grid") == '2' ) {
            $('.grid--view-items').removeClass('wide')
            $('.grid-toolbar-2').addClass('active')
            $('.grid-toolbar-3').removeClass('active')
          } else if (localStorage.getItem("grid") == '3') {
            $('.grid--view-items').addClass('wide')
            $('.grid-toolbar-2').removeClass('active')
            $('.grid-toolbar-3').addClass('active')
          }
        
        //   if (localStorage.getItem("collectionsList") == 'collapse' && window.innerWidth < 1024) {
        //     $('.collections-list').addClass('collapse')
        //     $('.toggle_list').addClass('active')
        //     $('.collection__main').addClass('expand')
        //   } 
        
          $(document).on('click', '.grid-toolbar-icon', function() {
            $(this).siblings().removeClass('active')
            $(this).addClass('active')
        
            localStorage.setItem("grid", $(this).data('value'))
            
        
            if($(this).data('value') == '3') {
              $('.grid--view-items').addClass('wide')
            } else {
              $('.grid--view-items').removeClass('wide')
            }
          })
        
        //   $(document).on('click', '.toggle_list', function() {
        //     $(this).toggleClass('active')
        //     if ($(this).hasClass('active')) {
        //       localStorage.setItem("collectionsList", 'collapse')
        //     } else {
        //       localStorage.setItem("collectionsList", 'expand')
        //     }
        
        //     $('.collections-list').toggleClass('collapse')
        //     $('.collection__main').toggleClass('expand')
        //   })
        
          $(document).on('click', '.filter-categories', function() {
            $(this).toggleClass('active')
            $('.collections-list').toggleClass('active')
            if ($(this).hasClass('active')) {
              $(this).find('span').text('Close')
            } else {
              $(this).find('span').text('Categories')
            }
          })
    }
    
})
// collection

// show pass on input[type=password]
$(function () {

    $('.show_pass').click(function(){
        let input = $(this).next();
        input.attr('type', input.attr('type') === 'password' ? 'text' : 'password');
    });
})
// show pass on input[type=password]

// cart popup

const cartDrawer = $('.cart-popup-wrapper')

const getCart = async () => {
    try {
        const config = {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            }
        }
        const response = await fetch('/cart.js', config)
        const json = await response.json()
        return json
    } catch (error) {
        console.log(error)
    }
}

const getProductByHandle = async (handle) => {
    try {
        const config = {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            }
        }

        const response = await fetch(`/products/${handle}.js`, config)
        const json = await response.json()
        return json
    } catch (error) {
        console.log(error)
    }
}

const buildCart = async (el) => {
    console.log('builded')
    const cartData = await getCart()

    console.log(cartData)

    
    $('.cart_popup__inner_content').html('')

    await cartData.items.forEach(async (element) => {
      
      const productByHandle = await getProductByHandle(element.handle)
      console.log(productByHandle)
      const cartItem = document.createElement("div");
      let compareAtPriceValueNotFormatted = ''
      let compareAtPriceValue = ''
      cartItem.classList.add('cart_popup__item');
      cartItem.dataset.variant = element.variant_id;
      
      productByHandle.variants.forEach(variant => {
          if (variant.id == element.variant_id) {
              if (variant.compare_at_price > variant.price) {
                  compareAtPriceValueNotFormatted = variant.compare_at_price * element.quantity
                  compareAtPriceValue = new Intl.NumberFormat('en-EN',{ style: 'currency', currency: 'USD' }).format((variant.compare_at_price / 100)* element.quantity) 
              } else {
                  compareAtPriceValueNotFormatted = element.final_line_price * element.quantity     
              }
          }
      })
      cartItem.innerHTML = `
          
          <div class="cart_popup__item_img_wr">
              <img src="${element.image}" alt="" loading='lazy'>
              
              <div class="cart_popup__remove">
                <div class="cart_popup__remove_icon"></div>
                <div class="cart_popup__remove_text">Remove From Cart</div>
              </div>
            </div>

          <div class="cart_popup__info">
              <div class="left">
                  <a href="${element.url}" class="cart_popup__title">${element.title}</a>
                  <div class="cart_popup__type">
                  ${el[0].dataset.collection} - ${element.variant_title}
                  </div>
              </div>

              <div class="right">
                  <div class="cart_popup__price cart_popup__price--compare" data-compare="${compareAtPriceValueNotFormatted}">${compareAtPriceValue}</div>
                  <div class="cart_popup__price">${new Intl.NumberFormat('en-EN',{ style: 'currency', currency: 'USD' }).format(element.final_line_price / 100)}</div>
              </div>
          </div>
      `;

      const cartInner = document.querySelector(".cart_popup__inner_content");
      cartInner.insertAdjacentElement('beforeEnd', cartItem);
    });
}

const addToCart = async (el) => {
    try {
      const data_variant = el[0].dataset.variant
      const data = {'id' : data_variant , 'quantity' : 1}

      const config = {
          method: 'POST',
          headers: {
              'Accept': 'application/json',
              'Content-Type': 'application/json',
          },
          body: JSON.stringify(data)
      }
      const response = await fetch('/cart/add.js', config)
      const json = await response.json()

      await buildCart(el)

      

        setTimeout(async () => {
            await calculateSum()
        }, 500);

      if (window.innerWidth > 767) {
        cartDrawer.addClass('cart-popup-wrapper--show')        
      }
      $('.product-form__cart-submit').addClass('submitted')

      $('.site-header__cart_arrow').addClass('active')
      $('.header_message').addClass('active')
      $('.product-form__cart-submit').attr('disabled', false)
      setTimeout(() => {
        $('.site-header__cart_arrow').removeClass('active')
        $('.header_message').removeClass('active')
      }, 2000);
      
    } catch (error) {
        console.log(error)
    }
}

const calculateSum = async () => {
    try {
        $('.cart_popup__bottom_value--subtotal').text('...')
        $('.cart_popup__bottom_value--discount').text('...')
        $('.cart_popup__bottom_value--total').text('...')
        const cartData = await getCart()
        console.log(cartData)
        $('.cart_count').html(cartData.item_count)
        $('[data-cart-count]').html(cartData.item_count)
        if (cartData.item_count > 0) {

            // calc subtotal
            let subtotalPrice = 0
            document.querySelectorAll('.cart_popup__price--compare').forEach(el => {
                subtotalPrice += +el.dataset.compare                
            })
            // calc subtotal

            // calc discount sum
            let discountPrice = subtotalPrice - cartData.total_price
            // calc discount sum

            $('.cart_popup__bottom_value--subtotal').text(new Intl.NumberFormat('en-EN',{ style: 'currency', currency: 'USD' }).format(subtotalPrice / 100))
            $('.cart_popup__bottom_value--discount').text('-'+ new Intl.NumberFormat('en-EN',{ style: 'currency', currency: 'USD' }).format(discountPrice / 100))
            $('.cart_popup__bottom_value--total').text(new Intl.NumberFormat('en-EN',{ style: 'currency', currency: 'USD' }).format(cartData.total_price / 100))
            $('.cart-popup-wrapper_content').removeClass('hidden')
            $('.cart-popup-wrapper_empty').addClass('hidden')
        } else {
            $('.cart-popup-wrapper_content').addClass('hidden')
            $('.cart-popup-wrapper_empty').removeClass('hidden')
        }
        
    } catch (error) {
        console.log(error)
    }
    
}


var ovi = $('[data-cart-count]').html();
// If the cart count is 0, add the kuca class to .site-header__icon
  if (ovi == 0) {
    $('.site-header__icon').addClass('kuca');
  }
  // Otherwise, remove the kuca class from .site-header__icon
  else {
    $('.site-header__icon').removeClass('kuca');
  }

$('[data-cart-count]').on('DOMSubtreeModified', function() {
  // Get the value of the data-cart-count attribute
  var cartCount = $(this).html();

  // If the cart count is 0, add the kuca class to .site-header__icon
  if (cartCount == 0) {
    $('.site-header__icon').addClass('kuca');
  }
  // Otherwise, remove the kuca class from .site-header__icon
  else {
    $('.site-header__icon').removeClass('kuca');
  }
});

const removeItemFromCart = async (cartItem) => {
    try {

        const data = {'id' : cartItem[0].dataset.variant , 'quantity' : 0}
        const config = {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data)
        }
        const response = await fetch('/cart/change.js', config)
        const json = await response.json()
        cartItem.remove()
        await checkProductsInCart()
        await calculateSum()
        
      } catch (error) {
          console.log(error)
      }
}

const checkProductsInCart = async () => {
    const cartProducts = await getCart()
    let counter = 0
    cartProducts.items.forEach(el  => {

        if (el.variant_id == $('.product-form__cart-submit').attr('data-variant')) {  
            counter++
        } 
    })

    if (counter > 0) {
        $('.product-form__cart-submit').addClass('submitted')
    } else {
        $('.product-form__cart-submit').removeClass('submitted')
    }

    $('.product-form__cart-submit').attr('disabled', false)
    console.log(cartProducts)
}



if ($('.template-product').length) {
    window.onload = () => {
        setTimeout(() => {            
            checkProductsInCart()
            calculateSum()
            buildCart($('.product-form__cart-submit'))
            console.log('sds')   
        }, 1000);
    }
} else {
    window.onload = () => {
        calculateSum()  
    }
}

$(function() {
    $(document).on('click', '.product-form__cart-submit', function(e){
        e.preventDefault()
        if ($(this).hasClass('submitted')) {
            $('.cart-popup-wrapper').addClass('cart-popup-wrapper--show')
            if(!$('.cart-popup-wrapper').hasClass('cart-popup-wrapper--show')) {
                calculateSum()
            }
            return
        }
        $(this).attr('disabled', true)
        addToCart($(this))
    })
    $(document).on('click', '.cart_popup__remove', function() {
        removeItemFromCart($(this).closest('.cart_popup__item'))
    })
    $(document).on('click', '.cart-popup__close', function() {
        $('.cart-popup-wrapper').removeClass('cart-popup-wrapper--show')
    })
    $(document).on('click', '.site-header__cart', function() {
        $('.cart-popup-wrapper').addClass('cart-popup-wrapper--show')
        calculateSum()
    })
    $(document).on('click', function(e) {
        console.log(e.target)
        if (!e.target.closest('.site-header__icon') && !e.target.closest('.cart-popup-wrapper') && !e.target.closest('.product-form__cart-submit')) {
            $('.cart-popup-wrapper').removeClass('cart-popup-wrapper--show')
        }
    })
    $(document).on('click', '.header_message_close', function() {
        $('.header_message').removeClass('active')
        $('.site-header__cart_arrow').removeClass('active')
    })
})










// Get references to the two elements
const kecDiv = document.getElementById('kec');
const dvicaDiv = document.getElementById('dvica');

// Function to replicate changes from #kec to #dvica
function replicateChanges() {
  dvicaDiv.innerHTML = kecDiv.innerHTML;
}

// Watch for changes in #kec using MutationObserver
const observer = new MutationObserver(replicateChanges);
const config = { childList: true, subtree: true };
observer.observe(kecDiv, config);

