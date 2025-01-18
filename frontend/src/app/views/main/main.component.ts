import {Component, Input} from '@angular/core';
import {ArticleType} from "../../../types/article.type";
import {MatDialog} from "@angular/material/dialog";
import {Subscription} from "rxjs";
import {ArticlesService} from "../../shared/services/articles.service";

import {OwlOptions} from "ngx-owl-carousel-o";
import {OrderPopupComponent} from "../../shared/components/order-popup/order-popup.component";
import {ConsultationPopupComponent} from "../../shared/components/consultation-popup/consultation-popup.component";

@Component({
  selector: 'app-main',
  standalone: false,
  templateUrl: './main.component.html',
  styleUrl: './main.component.less'
})
export class MainComponent {
  bestArticles: ArticleType[] = [];

  private subscription: Subscription = new Subscription();

  public shares = [
    {
      subtitle: 'Предложение месяца',
      title: 'Продвижение в Instagram для вашего бизнеса <span class="selection">-15%</span>!',
      image: 'banner1.png',
      category: 'таргет'
    },
    {
      subtitle: 'Акция',
      title: 'Нужен грамотный <span class="selection">копирайтер</span>?',
      image: 'banner2.png',
      description: 'Весь декабрь у нас действует акция на работу копирайтера.',
      category: 'копирайтинг'
    },
    {
      subtitle: 'Новость дня',
      title: '<span class="selection">6 место</span> в ТОП-10 SMM-агенств Москвы!',
      image: 'banner3.png',
      description: 'Мы благодарим каждого, кто голосовал за нас!',
      category: 'smm'
    },
  ];

  customOptions: OwlOptions = {
    autoWidth: true,
    loop: true,
    mouseDrag: true,
    touchDrag: true,
    pullDrag: false,
    dots: true,
    navSpeed: 700,
    navText: ['', ''],
    responsive: {
      0: {
        items: 1
      },
      400: {
        items: 1
      },
      740: {
        items: 1
      },
      940: {
        items: 1
      }
    },
    nav: false
  };
  customOptionsRev: OwlOptions = {
    autoWidth: true,
    loop: true,
    mouseDrag: true,
    touchDrag: true,
    pullDrag: false,
    dots: false,
    navSpeed: 700,
    margin: 20,
    navText: ['', ''],
    responsive: {
      0: {
        items: 1
      },
      400: {
        items: 1
      },
      740: {
        items: 2
      },
      940: {
        items: 3
      }
    },
    nav: false
  };

  public services_data = [
    {
      id: '1',
      title: "Создание сайтов",
      description: "В краткие сроки мы создадим качественный и самое главное продающий сайт для продвижения Вашего бизнеса!",
      image: "site.png",
      category: "Фриланс",
      price: '7 500'
    },
    {
      id: '2',
      title: "Продвижение",
      description: "Вам нужен качественный SMM-специалист или грамотный таргетолог? Мы готовы оказать Вам услугу “Продвижения” на наивысшем уровне!",
      image: "smm.png",
      category: "SMM",
      price: '3 500'
    },
    {
      id: '3',
      title: "Реклама",
      description: "Без рекламы не может обойтись ни один бизнес или специалист. Обращаясь к нам, мы гарантируем быстрый прирост клиентов за счёт правильно настроенной рекламы.",
      image: "target.png",
      category: "Таргет",
      price: '1 000'
    },
    {
      id: '4',
      title: "Копирайтинг",
      description: "Наши копирайтеры готовы написать Вам любые продающие текста, которые не только обеспечат рост охватов, но и помогут выйти на новый уровень в продажах.",
      image: "copy.png",
      category: "Копирайтинг",
      price: '750'
    },
  ];

  public reviews = [
    {
      name: 'Станислав',
      image: 'review1.png',
      text: 'Спасибо огромное АйтиШторму за прекрасный блог с полезными статьями! Именно они и побудили меня углубиться в тему SMM и начать свою карьеру.'
    },
    {
      name: 'Алёна',
      image: 'review2.png',
      text: 'Обратилась в АйтиШторм за помощью копирайтера. Ни разу ещё не пожалела! Ребята действительно вкладывают душу в то, что делают, и каждый текст, который я получаю, с нетерпением хочется выложить в сеть.'
    },
    {
      name: 'Мария',
      image: 'review3.png',
      text: 'Команда АйтиШторма за такой короткий промежуток времени сделала невозможное: от простой фирмы по услуге продвижения выросла в мощный блог о важности личного бренда. Класс!'
    },
  ]

  constructor(private articlesService: ArticlesService, public dialog: MatDialog) {

  }

  ngOnInit(): void {
    this.subscription.add(this.articlesService.getBestArticles()
      .subscribe((data: ArticleType[]) => {
        this.bestArticles = data;
      }))
  }

  openPopup(category?: string): void {
    const dialogRef = this.dialog.open(OrderPopupComponent, {
      data: {category}
    });
    this.subscription.add(dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.dialog.open(OrderPopupComponent, {
          data: {}
        });
      }
    }));
  }
}
