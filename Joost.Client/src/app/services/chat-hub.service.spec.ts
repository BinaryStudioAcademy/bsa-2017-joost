import { TestBed, inject } from '@angular/core/testing';

import { ChatHubService } from './chat-hub.service';

describe('ChatHubService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ChatHubService]
    });
  });

  it('should be created', inject([ChatHubService], (service: ChatHubService) => {
    expect(service).toBeTruthy();
  }));
});
