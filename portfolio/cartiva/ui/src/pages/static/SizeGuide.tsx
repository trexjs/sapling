import React from 'react';
import styled from 'styled-components';
import { Section, SectionTitle } from '../../styles/App.styles';

const SizeGuideContainer = styled.div`
  padding-top: 100px;
  min-height: 100vh;
`;

const ContentContainer = styled.div`
  max-width: 1000px;
  margin: 0 auto;
  padding: 0 20px;
`;

const HeroSection = styled.div`
  text-align: center;
  margin-bottom: 4rem;
`;

const HeroTitle = styled.h1`
  font-size: 3rem;
  font-weight: 700;
  color: #1a1a1a;
  margin-bottom: 1.5rem;
  
  @media (max-width: 768px) {
    font-size: 2.5rem;
  }
`;

const HeroSubtitle = styled.p`
  font-size: 1.25rem;
  color: #666;
  line-height: 1.6;
`;

const ContentSection = styled.div`
  margin-bottom: 3rem;
`;

const ContentTitle = styled.h2`
  font-size: 2rem;
  font-weight: 600;
  color: #1a1a1a;
  margin-bottom: 1.5rem;
`;

const ContentText = styled.p`
  font-size: 1rem;
  color: #666;
  line-height: 1.8;
  margin-bottom: 1.5rem;
`;

const SizeTable = styled.table`
  width: 100%;
  border-collapse: collapse;
  margin: 2rem 0;
  background: white;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  
  th, td {
    padding: 1rem;
    text-align: center;
    border-bottom: 1px solid #f0f0f0;
  }
  
  th {
    background: #1a1a1a;
    color: white;
    font-weight: 600;
    font-size: 0.875rem;
  }
  
  td {
    color: #666;
    font-size: 0.875rem;
  }
  
  tr:hover {
    background: #f8f9fa;
  }
`;

const SizeGuideGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
  margin: 3rem 0;
`;

const SizeGuideCard = styled.div`
  padding: 2rem;
  background: #f8f9fa;
  border-radius: 8px;
  
  h3 {
    font-size: 1.25rem;
    font-weight: 600;
    color: #1a1a1a;
    margin-bottom: 1rem;
    text-align: center;
  }
`;

const MeasurementGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
  margin: 2rem 0;
`;

const MeasurementCard = styled.div`
  padding: 1rem;
  background: white;
  border-radius: 4px;
  text-align: center;
  
  h4 {
    font-size: 0.875rem;
    font-weight: 600;
    color: #1a1a1a;
    margin-bottom: 0.5rem;
  }
  
  p {
    color: #666;
    font-size: 0.875rem;
    margin: 0;
  }
`;

const TipsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 2rem;
  margin: 3rem 0;
`;

const TipCard = styled.div`
  padding: 1.5rem;
  background: #f8f9fa;
  border-radius: 8px;
  
  h3 {
    font-size: 1.125rem;
    font-weight: 600;
    color: #1a1a1a;
    margin-bottom: 0.75rem;
  }
  
  p {
    color: #666;
    line-height: 1.6;
    margin: 0;
  }
`;

const SizeGuide: React.FC = () => {
  return (
    <SizeGuideContainer>
      <ContentContainer>
        <HeroSection>
          <HeroTitle>Size Guide</HeroTitle>
          <HeroSubtitle>
            Find your perfect fit with our comprehensive size guide. We want you to love how your RARE items look and feel.
          </HeroSubtitle>
        </HeroSection>

        <ContentSection>
          <ContentTitle>How to Measure</ContentTitle>
          <ContentText>
            For the most accurate sizing, measure yourself wearing minimal clothing. Use a flexible measuring tape 
            and measure against your body, not over clothing.
          </ContentText>
          
          <MeasurementGrid>
            <MeasurementCard>
              <h4>Chest</h4>
              <p>Measure around the fullest part of your chest, keeping the tape horizontal</p>
            </MeasurementCard>
            
            <MeasurementCard>
              <h4>Waist</h4>
              <p>Measure around your natural waistline, usually the narrowest part of your torso</p>
            </MeasurementCard>
            
            <MeasurementCard>
              <h4>Hips</h4>
              <p>Measure around the fullest part of your hips, about 7-9 inches below your waist</p>
            </MeasurementCard>
            
            <MeasurementCard>
              <h4>Inseam</h4>
              <p>Measure from the crotch to the bottom of your ankle bone</p>
            </MeasurementCard>
          </MeasurementGrid>
        </ContentSection>

        <ContentSection>
          <ContentTitle>Men's Sizing</ContentTitle>
          <SizeTable>
            <thead>
              <tr>
                <th>Size</th>
                <th>Chest (in)</th>
                <th>Waist (in)</th>
                <th>Hips (in)</th>
                <th>Inseam (in)</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>XS</td>
                <td>32-34</td>
                <td>28-30</td>
                <td>32-34</td>
                <td>30</td>
              </tr>
              <tr>
                <td>S</td>
                <td>34-36</td>
                <td>30-32</td>
                <td>34-36</td>
                <td>30</td>
              </tr>
              <tr>
                <td>M</td>
                <td>36-38</td>
                <td>32-34</td>
                <td>36-38</td>
                <td>32</td>
              </tr>
              <tr>
                <td>L</td>
                <td>38-40</td>
                <td>34-36</td>
                <td>38-40</td>
                <td>32</td>
              </tr>
              <tr>
                <td>XL</td>
                <td>40-42</td>
                <td>36-38</td>
                <td>40-42</td>
                <td>34</td>
              </tr>
              <tr>
                <td>XXL</td>
                <td>42-44</td>
                <td>38-40</td>
                <td>42-44</td>
                <td>34</td>
              </tr>
            </tbody>
          </SizeTable>
        </ContentSection>

        <ContentSection>
          <ContentTitle>Women's Sizing</ContentTitle>
          <SizeTable>
            <thead>
              <tr>
                <th>Size</th>
                <th>Bust (in)</th>
                <th>Waist (in)</th>
                <th>Hips (in)</th>
                <th>Length (in)</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>XS</td>
                <td>32-33</td>
                <td>24-25</td>
                <td>34-35</td>
                <td>22</td>
              </tr>
              <tr>
                <td>S</td>
                <td>34-35</td>
                <td>26-27</td>
                <td>36-37</td>
                <td>22</td>
              </tr>
              <tr>
                <td>M</td>
                <td>36-37</td>
                <td>28-29</td>
                <td>38-39</td>
                <td>23</td>
              </tr>
              <tr>
                <td>L</td>
                <td>38-39</td>
                <td>30-31</td>
                <td>40-41</td>
                <td>23</td>
              </tr>
              <tr>
                <td>XL</td>
                <td>40-41</td>
                <td>32-33</td>
                <td>42-43</td>
                <td>24</td>
              </tr>
              <tr>
                <td>XXL</td>
                <td>42-43</td>
                <td>34-35</td>
                <td>44-45</td>
                <td>24</td>
              </tr>
            </tbody>
          </SizeTable>
        </ContentSection>

        <ContentSection>
          <ContentTitle>Kids' Sizing</ContentTitle>
          <SizeGuideGrid>
            <SizeGuideCard>
              <h3>Toddler (2T-5T)</h3>
              <SizeTable>
                <thead>
                  <tr>
                    <th>Size</th>
                    <th>Age</th>
                    <th>Height</th>
                    <th>Weight</th>
                  </tr>
                </thead>
                <tbody>
                  <tr><td>2T</td><td>2</td><td>33-35"</td><td>26-28 lbs</td></tr>
                  <tr><td>3T</td><td>3</td><td>35-38"</td><td>28-32 lbs</td></tr>
                  <tr><td>4T</td><td>4</td><td>38-41"</td><td>32-36 lbs</td></tr>
                  <tr><td>5T</td><td>5</td><td>41-44"</td><td>36-42 lbs</td></tr>
                </tbody>
              </SizeTable>
            </SizeGuideCard>
            
            <SizeGuideCard>
              <h3>Youth (4-16)</h3>
              <SizeTable>
                <thead>
                  <tr>
                    <th>Size</th>
                    <th>Age</th>
                    <th>Height</th>
                    <th>Weight</th>
                  </tr>
                </thead>
                <tbody>
                  <tr><td>4</td><td>4-5</td><td>40-43"</td><td>35-42 lbs</td></tr>
                  <tr><td>6</td><td>6-7</td><td>44-47"</td><td>42-49 lbs</td></tr>
                  <tr><td>8</td><td>8-9</td><td>48-51"</td><td>49-58 lbs</td></tr>
                  <tr><td>10</td><td>10-11</td><td>52-55"</td><td>58-70 lbs</td></tr>
                  <tr><td>12</td><td>12-13</td><td>56-59"</td><td>70-85 lbs</td></tr>
                  <tr><td>14</td><td>14-15</td><td>60-63"</td><td>85-100 lbs</td></tr>
                  <tr><td>16</td><td>16+</td><td>64-67"</td><td>100+ lbs</td></tr>
                </tbody>
              </SizeTable>
            </SizeGuideCard>
          </SizeGuideGrid>
        </ContentSection>

        <ContentSection>
          <ContentTitle>Size Guide Tips</ContentTitle>
          <TipsGrid>
            <TipCard>
              <h3>📏 Measure Twice</h3>
              <p>
                Always measure yourself twice to ensure accuracy. If measurements fall between sizes, 
                we recommend sizing up for comfort.
              </p>
            </TipCard>
            
            <TipCard>
              <h3>👕 Consider Fit Preference</h3>
              <p>
                Think about how you like your clothes to fit. If you prefer a looser fit, consider 
                sizing up. For a more fitted look, stick to your measurements.
              </p>
            </TipCard>
            
            <TipCard>
              <h3>🔄 Check Return Policy</h3>
              <p>
                Not sure about your size? We offer free returns and exchanges within 30 days, 
                so you can order with confidence.
              </p>
            </TipCard>
            
            <TipCard>
              <h3>📞 Ask for Help</h3>
              <p>
                Still unsure? Contact our customer service team for personalized sizing assistance. 
                We're here to help you find the perfect fit.
              </p>
            </TipCard>
          </TipsGrid>
        </ContentSection>

        <ContentSection>
          <ContentTitle>International Size Conversion</ContentTitle>
          <ContentText>
            Our size charts are based on US sizing. If you're shopping from outside the US, 
            please refer to our international size conversion chart or contact customer service 
            for assistance with sizing.
          </ContentText>
        </ContentSection>
      </ContentContainer>
    </SizeGuideContainer>
  );
};

export default SizeGuide;
